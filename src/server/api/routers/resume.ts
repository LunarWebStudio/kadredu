import { eq } from "drizzle-orm";
import { ResumeSchema } from "~/lib/shared/types/resume";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { resume } from "~/server/db/schema";

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

      await ctx.managers
        .achievement
        .countEvent(ctx.session.user.id, "CREATE_RESUME");

    }),

  getSelf: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.resume.findFirst({
      where: eq(resume.userId, ctx.session.user.id),
    });
  }),
});
