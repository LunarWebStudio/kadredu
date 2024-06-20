import { TRPCError } from "@trpc/server";
import { and, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { Github } from "~/lib/server/github";
import {
  IdInputSchema,
  PortfolioProjectInputSchema,
  UsernameInputSchema
} from "~/lib/shared/types";
import {
  createTRPCRouter,
  githubProcedure,
  protectedProcedure
} from "~/server/api/trpc";
import { portfolioProjects, projectLike, users } from "~/server/db/schema";

export const portfolioRouter = createTRPCRouter({
  create: githubProcedure
    .input(PortfolioProjectInputSchema)
    .mutation(async ({ ctx, input }) => {
      const repo = await ctx.github.GetRepo(input.repoName);

      if (!repo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Репозиторий не найден"
        });
      }

      return (await ctx.db
        .insert(portfolioProjects)
        .values({
          ...input,
          userId: ctx.session.user.id,
          repoOwner: repo.owner,
          repoName: repo.name
        }).returning())[0]!;
    }),
  update: protectedProcedure
    .input(z.intersection(IdInputSchema, PortfolioProjectInputSchema))
    .mutation(async ({ ctx, input }) => {
      // TODO: Update когда макс сделает кнопку
      return null;
    }),
  delete: protectedProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(portfolioProjects)
        .where(eq(portfolioProjects.id, input.id));
    }),
  getByUsername: protectedProcedure
    .input(UsernameInputSchema)
    .query(async ({ ctx, input }) => {
      const repos = await ctx.db.query.portfolioProjects.findMany({
        where: and(
          eq(portfolioProjects.userId, ctx.session.user.id),
          ilike(portfolioProjects.repoOwner, `%${input.username}%`)
        ),
        with: {
          likes: true,
          user: true
        }
      })

      const token = await ctx.db.query.users.findFirst({
        where: eq(users.username, input.username),
        columns: {
          githubToken: true,
          githubUsername: true
        }
      })

      const github = new Github({
        username: token?.githubUsername ?? "",
        token: token?.githubToken ?? ""
      })

      return await Promise.all(repos.map(async repo => {
        const languages = await github.GetLanguages(repo.repoName);
        return {
          ...repo,
          languages
        }
      }))
    }),
  getOne: protectedProcedure
    .input(IdInputSchema)
    .query(async ({ ctx, input }) => {
      const repo = await ctx.db.query.portfolioProjects.findFirst({
        where: eq(portfolioProjects.id, input.id),
        with: {
          likes: true,
          user: true
        }
      })

      if (!repo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Проект не найден"
        });
      }

      const token = await ctx.db.query.users.findFirst({
        where: eq(users.id, repo?.userId),
        columns: {
          githubToken: true,
          githubUsername: true
        }
      })

      const github = new Github({
        username: token?.githubUsername ?? "",
        token: token?.githubToken ?? ""
      })

      const githubRepo = await github.GetRepo(repo.repoName);

      return {
        ...repo,
        url: githubRepo.url,
        languages: await github.GetLanguages(repo.repoName),
        tree: await github.GetTree(repo.repoName),
        readme: await github.GetReadme(repo.repoName)
      }
    }),
  toggleLike: protectedProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const condition = and(
        eq(projectLike.projectId, input.id),
        eq(projectLike.userId, ctx.session.user.id)
      )

      const like = await ctx.db.query.projectLike.findFirst({
        where: condition
      })

      if (like) {
        await ctx.db.delete(projectLike).where(condition)
        return;
      }

      await ctx.db.insert(projectLike).values({
        projectId: input.id,
        userId: ctx.session.user.id
      })
    })
});
