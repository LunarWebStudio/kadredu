import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { Github } from "~/lib/server/github";
import { monthAgo, today } from "~/lib/shared/time";
import { DateSchema } from "~/lib/shared/types";
import { UsernameSchema } from "~/lib/shared/types/user";
import { createTRPCRouter, githubProcedure, protectedProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const githubRouter = createTRPCRouter({
  getOwnedRepos: githubProcedure.query(async ({ ctx }) => {
    return await ctx.github.GetRepos();
  }),
  getUserEvents: protectedProcedure
    .input(z.intersection(UsernameSchema, z.object({time:DateSchema})))
    .query(async ({ ctx, input }) =>{
      const user = await ctx.db.query.users.findFirst({
        where:eq(users.username, input.username),
        columns:{
          githubToken:true,
          githubUsername:true
        }
      });

      if(!user || !user.githubToken || !user.githubUsername){
        throw new TRPCError({
          code:"NOT_FOUND",
          message:"Пользователь не найден"
        })
      }

      const github = new Github({
        token:user.githubToken,
        username:user.githubUsername
      })

      return (await github.GetUserEvents(user.githubUsername))
        .filter((event) => new Date(input?.time?.from || monthAgo).getTime() < new Date(event.created_at!).getTime() && new Date(input?.time?.to || today).getTime() > new Date(event.created_at!).getTime())
        .sort((a, b) => {
            return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime();
        }).reverse()
    })
});
