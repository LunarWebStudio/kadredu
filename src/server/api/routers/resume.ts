import { eq } from "drizzle-orm";
import { ResumeSchema } from "~/lib/shared/types/resume";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { recevedAchievements, resume } from "~/server/db/schema";

export const resumeRouter = createTRPCRouter({
  updateSelf: protectedProcedure
    .input(ResumeSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(resume)
        .values({
          ...input,
          userId: ctx.session.user.id,
        })
        .onConflictDoUpdate({
          target: resume.userId,
          set: {
            ...input,
            userId: ctx.session.user.id,
          },
        });

      ctx.redis.countEvent(ctx.session.user.id, "CREATE_RESUME", (id) =>{
        ctx.db.insert(recevedAchievements)
          .values({
            userId: ctx.session.user.id,
            achievementId: id,
          })
      })
    }),

  getSelf: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.resume.findFirst({
      where: eq(resume.userId, ctx.session.user.id),
    });
  }),
});
