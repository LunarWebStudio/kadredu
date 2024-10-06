import { AchievementSchema } from "~/lib/shared/types/achievements";
import { createTRPCRouter, leadCycleComissionProcedure, protectedProcedure } from "../trpc";
import { achievements, recevedAchievements, users } from "~/server/db/schema";
import { createCaller } from "../root";
import { eq } from "drizzle-orm";
import { IdSchema } from "~/lib/shared/types/utils";
import { UsernameSchema } from "~/lib/shared/types/user";
import { TRPCError } from "@trpc/server";




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
      await ctx.managers
        .achievement
        .deleteAchievement(input.id)
    }),
  getAll: leadCycleComissionProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.query.achievements.findMany()
  }),
  getById: protectedProcedure
    .input(IdSchema)
    .query(async ({ctx,input}) =>{
      const receved = await ctx.db.query.recevedAchievements.findMany({
        where:eq(recevedAchievements.userId, input.id),
        with:{
          achievement:true,
        }
      })

      return receved
    })
})
