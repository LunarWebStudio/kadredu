import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { TutorialInputShema } from "~/lib/shared/types/tutorial";
import {
  createTRPCRouter,
  highLevelProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { createCaller } from "../root";
import { tutorials } from "~/server/db/schema";
import { IdSchema } from "~/lib/shared/types/utils";

export const tutorialsRouter = createTRPCRouter({
  create: highLevelProcedure
    .input(TutorialInputShema)
    .mutation(async ({ ctx, input }) => {
      const caller = createCaller(ctx);
      const { id } = await caller.file.create(input.image);

      await ctx.db.insert(tutorials).values({
        ...input,
        imageId: id,
        authorId: ctx.session.user.id,
      });
    }),
  update: highLevelProcedure
    .input(TutorialInputShema.merge(IdSchema))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.roles.includes("ADMIN")) {
        const tutorial = await ctx.db.query.tutorials.findFirst({
          where: eq(tutorials.id, input.id),
          columns: {
            authorId: true,
          },
        });
        if (tutorial?.authorId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Недостаточно прав для данного действия",
          });
        }
      }

      var imageId: string | undefined;
      if (!input.id) {
        const caller = createCaller(ctx);
        ({ id: imageId } = await caller.file.create(input.image));
      }

      await ctx.db
        .update(tutorials)
        .set({
          ...input,
          imageId,
        })
        .where(eq(tutorials.id, input.id));
    }),

  delete: highLevelProcedure
    .input(IdSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.roles.includes("ADMIN")) {
        const authorId = await ctx.db.query.tutorials.findFirst({
          where: eq(tutorials.id, input.id),
        });
        if (authorId?.authorId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Недостаточно прав для данного действия",
          });
        }
      }

      await ctx.db.delete(tutorials).where(eq(tutorials.id, input.id));
    }),
  getAll: highLevelProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.tutorials.findMany({
      with: {
        author: true,
        subject: true,
        image: true,
        topic: true,
      },
    });
  }),

  getOne: protectedProcedure.input(IdSchema).query(async ({ ctx, input }) => {
    return await ctx.db.query.tutorials.findFirst({
      where: eq(tutorials.id, input.id),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            username: true,
          },
        },
        topic: true,
        image: true,
      },
    });
  }),
});
