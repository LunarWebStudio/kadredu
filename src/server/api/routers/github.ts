import { TRPCError } from "@trpc/server";
import { compareDesc, eachDayOfInterval, endOfYear,  set,  startOfYear } from "date-fns";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { Github } from "~/lib/server/github";
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

      const to = endOfYear(new Date())
      const from = startOfYear(new Date())

      const days = eachDayOfInterval({
        start:from,
        end:to
      })


      const events = (await github.GetUserEvents(user.githubUsername))

      return days.map(day =>{
        let count = 0;
        events.map(event => {
          if (
            compareDesc(
              set(
                new Date(event.created_at!),
                {
                  hours:0,
                  minutes:0,
                  seconds:0
                }),
              day
            ) === 0
          ){
            count++
          }
        })

        return {
          date:day,
          count
        }
      })
    })
});
