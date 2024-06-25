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
      await ctx.db.insert(topics).values(input);
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
      await ctx.db.update(topics).set(input).where(eq(topics.id, input.id));
    })
});

