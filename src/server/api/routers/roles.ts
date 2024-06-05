import { TRPCError } from "@trpc/server";
import { and, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { IdInputSchema, RoleInputSchema } from "~/lib/shared/types";
import { adminProcedure, publicProcedure } from "~/server/api/trpc";
import { teamRoles } from "~/server/db/schema";

export const teamRolesRouter = {
  getAll: publicProcedure
    .input(
      z.object({
        search: z.string().optional()
      })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return (
        await ctx.db.query.teamRoles.findMany({
          where: and(
            input?.search
              ? ilike(teamRoles.name, `%${input.search}%`)
              : undefined
          )
        })
      ).reverse();
    }),
  create: adminProcedure
    .input(RoleInputSchema)
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db.insert(teamRoles).values({ name: input.name }).returning()
      )[0];
    }),
  update: adminProcedure
    .input(z.intersection(IdInputSchema, RoleInputSchema))
    .mutation(async ({ ctx, input }) => {
      const existRole = await ctx.db.query.teamRoles.findFirst({
        where: eq(teamRoles.id, input.id)
      });
      if (!existRole) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Роль не найденна"
        });
      }
      return (
        await ctx.db
          .update(teamRoles)
          .set({
            name: input.name
          })
          .where(eq(teamRoles.id, input.id))
          .returning()
      )[0];
    }),
  delete: adminProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(teamRoles).where(eq(teamRoles.id, input.id));
    })
};
