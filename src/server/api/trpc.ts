import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import GetLevel from "~/lib/shared/level";

import { eq } from "drizzle-orm";
import { Github } from "~/lib/server/github";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();

  return {
    db,
    session,
    ...opts
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
      }
    };
  }
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const verificationProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Для выполнения данного действия необходимо авторизоваться"
    });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user }
    }
  });
});

export const protectedProcedure = verificationProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role.length === 0) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user }
    }
  });
});

const FORBIDDEN_MESSAGE = "У вас недостаточно прав для данного действия";
const HIGH_LEVEL_THRESHOLD = 3;

export const githubProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const data = await ctx.db.query.users.findFirst({
    where: eq(users.id, ctx.session.user.id),
    columns: {
      githubUsername: true,
      githubToken: true
    }
  });

  if (!data?.githubToken || !data?.githubUsername) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: FORBIDDEN_MESSAGE
    });
  }

  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: {
          ...ctx.session.user,
          githubUsername: data.githubUsername,
          githubToken: data.githubToken
        }
      },
      github: new Github({
        username: data.githubUsername,
        token: data.githubToken
      })
    }
  });
});

export const highLevelProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (
    ctx.session?.user.role.includes("ADMIN") ||
    ctx.session.user.role.includes("TEACHER")
  ) {
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user }
      }
    });
  }

  if (GetLevel(ctx.session.user.experiencePoints) < HIGH_LEVEL_THRESHOLD) {
    throw new TRPCError({ code: "FORBIDDEN", message: FORBIDDEN_MESSAGE });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user }
    }
  });
});

export const teacherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session?.user.role.includes("ADMIN")) {
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user }
      }
    });
  }

  if (!ctx.session.user.role.includes("TEACHER")) {
    throw new TRPCError({ code: "FORBIDDEN", message: FORBIDDEN_MESSAGE });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user }
    }
  });
});

export const leadCycleComissionProcedure = protectedProcedure.use(
  ({ ctx, next }) => {
    if (ctx.session?.user.role.includes("ADMIN")) {
      return next({
        ctx: {
          session: { ...ctx.session, user: ctx.session.user }
        }
      });
    }

    if (!ctx.session.user.role.includes("LEAD_CYCLE_COMISSION")) {
      throw new TRPCError({ code: "FORBIDDEN", message: FORBIDDEN_MESSAGE });
    }

    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user }
      }
    });
  }
);

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.session.user.role.includes("ADMIN")) {
    throw new TRPCError({ code: "FORBIDDEN", message: FORBIDDEN_MESSAGE });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user }
    }
  });
});
