import { TRPCError } from "@trpc/server";
import { and, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { IdInputSchema, TopicsInputShema } from "~/lib/shared/types";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure
} from "~/server/api/trpc";
import { topics } from "~/server/db/schema";

export const topicsRouter = createTRPCRouter({
  create: adminProcedure
    .input(TopicsInputShema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.insert(topics).values(input);
      } catch (err: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (err.code === "23505") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Тема с таким названием уже существует"
          });
        }

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Не удалось создать тему"
        });
      }
    }),

  delete: adminProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(topics).where(eq(topics.id, input.id));
    }),

  getAll: protectedProcedure
    .input(
      z
        .object({
          search: z.string().optional()
        })
        .optional()
    )

    .query(async ({ ctx, input }) => {
      return await ctx.db.query.topics.findMany({
        where: and(
          input?.search ? ilike(topics.name, `%${input.search}%`) : undefined
        )
      });
    }),
  update: adminProcedure
    .input(z.intersection(IdInputSchema, TopicsInputShema))
    .mutation(async ({ ctx, input }) => {
      const t = await ctx.db.query.topics.findFirst({
        where: eq(topics.id, input.id)
      });

      if (!t) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Тема не найдена"
        });
      }

      try {
        await ctx.db.update(topics).set(input).where(eq(topics.id, input.id));
      } catch (err: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (err.code === "23505") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Тема с таким названием уже существует"
          });
        }

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Не удалось создать тему"
        });
      }
    })
});
