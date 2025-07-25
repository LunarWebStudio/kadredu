import { z } from "zod";
import { DateSchema } from "~/lib/shared/types";
import { UsernameSchema } from "~/lib/shared/types/user";
import { createTRPCRouter, githubProcedure } from "~/server/api/trpc";

export const githubRouter = createTRPCRouter({
  getOwnedRepos: githubProcedure.query(async ({ ctx }) => {
    return await ctx.github.GetRepos();
  }),
  getUserEvents: githubProcedure
    .input(z.intersection(UsernameSchema, z.object({ time: DateSchema })))
    .query(async ({ ctx, input }) => {
      return await ctx.github.GetUserEvents(input.username);
    }),
});
