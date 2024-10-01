import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { Github } from "~/lib/server/github";
import { day } from "~/lib/shared/time";
import { DateSchema } from "~/lib/shared/types";
import { ago, today } from "~/lib/shared/types/date";
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

      const to = new Date(input?.time?.to || today())
      const from = new Date(input?.time?.from || ago(1))
      const days = Math.ceil((to.getTime() - from.getTime()) / day)

      const daily = Array.from({length:days} ,
        (_, i) => {
        const date = from.getTime() + (i + 1) * day
        return{
          day:{
            date,
            start: new Date(date).setHours(0,0,0,0),
            end: new Date(date).setHours(23,59,59,999)
          },
          count:0
        }
      })

      const events = (await github.GetUserEvents(user.githubUsername))
        .filter((event) => from.getTime() < new Date(event.created_at!).getTime() && to.getTime() > new Date(event.created_at!).getTime())
        .sort((a, b) => {
            return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime();
        }).reverse()

      daily.forEach((day) => {
        events.forEach((event) => {
          const eventDate = new Date(event.created_at!).getTime();
          if (day.day.start <= eventDate && eventDate <= day.day.end) {
            day.count++;
          }
        });
      });

      return daily
    })
});
