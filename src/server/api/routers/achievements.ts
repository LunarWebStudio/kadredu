import { AchievementSchema } from "~/lib/shared/types/achievements";
import { createTRPCRouter, leadCycleComissionProcedure, protectedProcedure } from "../trpc";
import { achievements } from "~/server/db/schema";
import { createCaller } from "../root";
import { eq } from "drizzle-orm";
import { IdSchema } from "~/lib/shared/types/utils";




export const achievementsRouter = createTRPCRouter({
  create: leadCycleComissionProcedure
    .input(AchievementSchema)
    .mutation(async ({ ctx, input }) =>{
      const caller = createCaller(ctx);

      const { id } = await caller.file.create({
        ...input.image,
        b64: input.image.b64!,
      })

       const achievement = (await ctx.db
        .insert(achievements)
        .values({
          imageId: id,
          ...input
        }).returning())[0]!

      ctx.redis.createAchievement(achievement)

    }),
  update: leadCycleComissionProcedure
    .input(AchievementSchema.merge(IdSchema))
    .mutation(async ({ ctx, input }) => {
      let id: string | undefined;
      if (input.image.b64 !== undefined) {
        const caller = createCaller(ctx);
        ({ id } = await caller.file.create({
          ...input.image,
          b64: input.image.b64!,
        }));
      }

       await ctx.db
        .update(achievements)
        .set({
          ...input,
          imageId: id,
        })
        .where(eq(achievements.id, input.id))
  }),
  delete: leadCycleComissionProcedure
    .input(IdSchema)
    .mutation(async ({ ctx, input }) => {
      const achievement = (await ctx.db.delete(achievements).where(eq(achievements.id, input.id)).returning())[0]!
      ctx.redis.deleteAchievement(achievement.id, achievement.eventType)
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.achievements.findMany()
  }),
})
