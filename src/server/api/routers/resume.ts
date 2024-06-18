import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { ResumeInputSchema } from "~/lib/shared/types";
import { createTRPCRouter, verificationProcedure } from "~/server/api/trpc";
import { resume } from "~/server/db/schema";

export const resumeRouter = createTRPCRouter({
  updateSelf:verificationProcedure
  .input(ResumeInputSchema)
  .mutation(async ({ctx,input})=>{

    const existRole = await ctx.db.query.teamRoles
    .findFirst({
      where:eq(resume.id,input.roleId)
    })
    if(!existRole){
      throw new TRPCError({
        code:"NOT_FOUND",
        message:"Роль не найденна"
      })
    }
    await ctx.db.insert(resume)
    .values({
      userId:ctx.session.user.id,
      roleId:existRole.id,
      status:input.status
    }).onConflictDoUpdate({
        target:resume.userId,
        set:{
          roleId:existRole.id,
          status:input.status,
          experience:input.experience
        }
    })
  }),

  getSelf:verificationProcedure
  .query(async ({ctx})=>{
    return await ctx.db.query.resume.findFirst({
      where:eq(resume.userId,ctx.session.user.id)
    })
  })
})