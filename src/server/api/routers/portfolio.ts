import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { Github } from "~/lib/server/github";
import { IdInputSchema } from "~/lib/shared/types";
import { PortfolioProjectSchema } from "~/lib/shared/types/portfolio";
import { UsernameSchema } from "~/lib/shared/types/user";
import {
  createTRPCRouter,
  githubProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { projectLike, projects, users } from "~/server/db/schema";

export const portfolioRouter = createTRPCRouter({
  create: githubProcedure
    .input(PortfolioProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const repo = await ctx.github.GetRepo(input.repoName);

      return (
        await ctx.db
          .insert(projects)
          .values({
            ...input,
            userId: ctx.session.user.id,
            repoOwner: repo.owner,
            repoName: repo.name,
          })
          .returning()
      )[0]!;
    }),
  update: protectedProcedure
    .input(z.intersection(IdInputSchema, PortfolioProjectSchema))
    .mutation(async () => {
      // TODO: Update когда макс сделает кнопку
      return null;
    }),

  delete: protectedProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.delete(projects).where(eq(projects.id, input.id));
      } catch (_) {
        await ctx.db
          .update(projects)
          .set({ isDeleted: true })
          .where(eq(projects.id, input.id));
      }
    }),

  getByUsername: protectedProcedure
    .input(UsernameSchema)
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.username, input.username),
        with: {
          projects: {
            where: eq(projects.isDeleted, false),
            with: {
              likes: true,
            },
          },
        },
        columns: {
          username: true,
          githubToken: true,
          githubUsername: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code:"NOT_FOUND",
          message:"Пользователь ненайден"
        })
      }

      const github = new Github({
        username: user?.githubUsername ?? "",
        token: user?.githubToken ?? "",
      });

      return await Promise.all(
        user.projects.map(async (repo) => {
          const languages = await github.GetLanguages(repo.repoName);
          return {
            ...repo,
            username: user.username,
            languages,
          };
        })
      );
    }),

  getOne: protectedProcedure
    .input(IdInputSchema)
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        with: {
          projects: {
            where: and(
              eq(projects.isDeleted, false),
              eq(projects.id, input.id)
            ),
            with: {
              likes: true,
            },
          },
        },
        columns: {
          githubUsername: true,
          githubToken: true,
        },
      });

      if (!user?.projects?.[0]) {
        throw new TRPCError({
          code:"NOT_FOUND",
          message:"Проект ненайден"
        })
      }

      const project = user.projects[0];

      const github = new Github({
        username: user?.githubUsername ?? "",
        token: user?.githubToken ?? "",
      });

      const githubRepo = await github.GetRepo(project.repoName);

      return {
        ...project,
        url: githubRepo.url,
        languages: await github.GetLanguages(project.repoName),
        tree: await github.GetTree(project.repoName),
        readme: await github.GetReadme(project.repoName),
      };
    }),
  toggleLike: protectedProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const condition = and(
        eq(projectLike.projectId, input.id),
        eq(projectLike.userId, ctx.session.user.id)
      );

      const like = await ctx.db.query.projectLike.findFirst({
        where: condition,
      });

      if (like) {
        await ctx.db.delete(projectLike).where(condition);
        return;
      }

      await ctx.db.insert(projectLike).values({
        projectId: input.id,
        userId: ctx.session.user.id,
      });
    }),
});
