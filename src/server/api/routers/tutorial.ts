import { TRPCError } from "@trpc/server";
import { and, count, eq } from "drizzle-orm";
import { TutorialFilterSchema, TutorialInputShema } from "~/lib/shared/types/tutorial";
import {
  createTRPCRouter,
  highLevelProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { createCaller } from "../root";
import { recevedAchievements, topics, tutorials, users } from "~/server/db/schema";
import { IdSchema } from "~/lib/shared/types/utils";
import { UsernameSchema } from "~/lib/shared/types/user";

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
      
      await ctx.managers
        .achievement
        .countEvent(ctx.session.user.id, "CREATE_TUTORIAL");
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
  getAllNames: highLevelProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.tutorials.findMany({
      columns: {
        id: true,
        name: true,
      },
    });
  }),

  getAll: highLevelProcedure
  .input(TutorialFilterSchema)
  .query(async ({ ctx, input }) => {
    return await ctx.db.query.tutorials.findMany({
      with: {
        author:{
          where: and(
            eq(users.username, input!.username!).if(input?.username),
            eq(users.id, input!.userId!).if(input?.userId)
          ),
        },
        subject: true,
        image: true,
        topic:{
          where:eq(topics.name, input!.topicName!).if(input?.topicName)
        },
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

  getCount: protectedProcedure
  .input(UsernameSchema)
  .query(async ({ ctx, input }) =>{
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.username, input.username),
    })

    if(!user){
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Пользователь не найден",
      });
    }

    return (await ctx.db
      .select({ count: count() })
      .from(tutorials)
      .where(eq(tutorials.authorId, user.id)))[0]!
  })
});
