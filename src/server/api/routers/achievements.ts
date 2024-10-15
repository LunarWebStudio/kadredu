import { AchievementSchema } from "~/lib/shared/types/achievements";
import { createTRPCRouter, leadCycleComissionProcedure, protectedProcedure } from "../trpc";
import { achievements, recevedAchievements, users } from "~/server/db/schema";
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

      await ctx.managers
        .achievement
        .createAchievement({
          ...input,
          imageId: id,
        })

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

      ctx.managers
        .achievement
        .updateAchievement({
          ...input,
          imageId: id
        })
  }),
  delete: leadCycleComissionProcedure
    .input(IdSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.managers
        .achievement
        .deleteAchievement(input.id)
    }),
  getAll: leadCycleComissionProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.query.achievements.findMany({
        where: eq(achievements.isDeleted, false)
      })
  }),
  getById: protectedProcedure
    .input(IdSchema)
    .query(async ({ctx,input}) =>{
      return await ctx.db.query.recevedAchievements.findMany({
        where:eq(recevedAchievements.userId, input.id),
        with:{
          achievement:true,
        }
      })
    })
})
