import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

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

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user || ctx.session.user.role.length === 0) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
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
    throw new TRPCError({ code: "UNAUTHORIZED" });
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
      throw new TRPCError({ code: "UNAUTHORIZED" });
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
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user }
    }
  });
});
