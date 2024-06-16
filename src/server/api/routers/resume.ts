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
    console.log(input)
    const t = await ctx.db.insert(resume)
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
    }).returning()
    console.log(t)
  }),
  // getAll:verificationProcedure
  // .input(z.object({
  //   search:z.string().optional()
  // }).optional())
  // .mutation(async ({ctx,input})=>{
  //   return (await ctx.db.query.resume.findMany({})).reverse()
  // })
  getSelf:verificationProcedure
  .query(async ({ctx})=>{
    return await ctx.db.query.resume.findFirst({
      where:eq(resume.id,ctx.session.user.id)
    })
  })
})