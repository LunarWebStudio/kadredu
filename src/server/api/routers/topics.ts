import { eq } from "drizzle-orm";
import { TopicSchema } from "~/lib/shared/types/topic";
import { IdSchema } from "~/lib/shared/types/utils";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { topics } from "~/server/db/schema";

export const topicsRouter = createTRPCRouter({
  create: adminProcedure.input(TopicSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(topics).values(input);
  }),

  delete: adminProcedure.input(IdSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(topics).where(eq(topics.id, input.id));
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.topics.findMany();
  }),
  update: adminProcedure
    .input(TopicSchema.merge(IdSchema))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(topics).set(input).where(eq(topics.id, input.id));
    }),
});
