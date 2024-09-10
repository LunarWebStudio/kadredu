import { createTRPCRouter, githubProcedure } from "~/server/api/trpc";

export const githubRouter = createTRPCRouter({
  getOwnedRepos: githubProcedure.query(async ({ ctx }) => {
    return await ctx.github.GetRepos();
  }),
});
