import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { IdInputSchema, RoleInputSchema } from "~/lib/shared/types";
import { adminProcedure, publicProcedure } from "~/server/api/trpc";
import { teamRoles } from "~/server/db/schema";

export const teamRolesRouter = {
  getAll: publicProcedure.query(async ({ ctx }) => {
    const roles = await ctx.db.query.teamRoles.findMany();
    return roles.reverse();
  }),
  create: adminProcedure
    .input(RoleInputSchema)
    .mutation(async ({ ctx, input }) => {
      const existRole = await ctx.db.query.teamRoles.findFirst({
        where: eq(teamRoles.name, input.name)
      });

      if (existRole) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Данная роль уже существует"
        });
      }

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
