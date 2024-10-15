import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import GetLevel from "~/lib/shared/level";

import { eq } from "drizzle-orm";
import { Github } from "~/lib/server/github";
import { s3 } from "~/lib/server/s3";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { redis } from "~/lib/server/redis";
import { AchievementManager } from "~/lib/server/achievementManager";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();

  return {
    db,
    s3,
    redis,
    session,
    managers:{
      achievement: new AchievementManager(),
    },
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const verificationProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Для выполнения данного действия необходимо авторизоваться",
    });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = verificationProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.roles.length === 0) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const FORBIDDEN_MESSAGE = "У вас недостаточно прав для данного действия";
export const HIGH_LEVEL_THRESHOLD = 3;

export const githubProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const data = await ctx.db.query.users.findFirst({
    where: eq(users.id, ctx.session.user.id),
    columns: {
      githubUsername: true,
      githubToken: true,
    },
  });

  if (!data?.githubToken || !data?.githubUsername) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: FORBIDDEN_MESSAGE,
    });
  }

  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: {
          ...ctx.session.user,
          githubUsername: data.githubUsername,
          githubToken: data.githubToken,
        },
      },
      github: new Github({
        username: data.githubUsername,
        token: data.githubToken,
      }),
    },
  });
});

export const highLevelProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (
    ctx.session?.user.roles.includes("ADMIN") ||
    ctx.session.user.roles.includes("TEACHER")
  ) {
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  }

  if (
    GetLevel(ctx.session.user.experiencePoints).level < HIGH_LEVEL_THRESHOLD
  ) {
    throw new TRPCError({ code: "FORBIDDEN", message: FORBIDDEN_MESSAGE });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const teacherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session?.user.roles.includes("ADMIN")) {
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  }

  if (!ctx.session.user.roles.includes("TEACHER")) {
    throw new TRPCError({ code: "FORBIDDEN", message: FORBIDDEN_MESSAGE });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const leadCycleComissionProcedure = protectedProcedure.use(
  ({ ctx, next }) => {
    if (ctx.session?.user.roles.includes("ADMIN")) {
      return next({
        ctx: {
          session: { ...ctx.session, user: ctx.session.user },
        },
      });
    }

    if (!ctx.session.user.roles.includes("LEAD_CYCLE_COMISSION")) {
      throw new TRPCError({ code: "FORBIDDEN", message: FORBIDDEN_MESSAGE });
    }

    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  }
);

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.session.user.roles.includes("ADMIN")) {
    throw new TRPCError({ code: "FORBIDDEN", message: FORBIDDEN_MESSAGE });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
