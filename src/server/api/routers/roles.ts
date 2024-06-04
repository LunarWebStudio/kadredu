import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { IdInputSchema, RoleInputSchema } from "~/lib/shared/types";
import { adminProcedure, publicProcedure } from "~/server/api/trpc";
import { rolesTeam } from "~/server/db/schema";

export const RolesRouter = {
  getAll: publicProcedure.query(async ({ ctx }) => {
    const roles = await ctx.db.query.rolesTeam.findMany();
    return roles.reverse();
  }),
  create: adminProcedure
    .input(RoleInputSchema)
    .mutation(async ({ ctx, input }) => {
      const existRole = await ctx.db.query.rolesTeam.findFirst({
        where: eq(rolesTeam.name, input.name)
      });

      if (existRole) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Данная роль уже существует"
        });
      }

      return (
        await ctx.db.insert(rolesTeam).values({ name: input.name }).returning()
      )[0];
    }),
  update: adminProcedure
    .input(z.intersection(IdInputSchema, RoleInputSchema))
    .mutation(async ({ ctx, input }) => {
      const existRole = await ctx.db.query.rolesTeam.findFirst({
        where: eq(rolesTeam.id, input.id)
      });
      if (!existRole) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Роль не найденна"
        });
      }
      return (
        await ctx.db
          .update(rolesTeam)
          .set({
            name: input.name
          })
          .where(eq(rolesTeam.id, input.id))
          .returning()
      )[0];
    }),
  delete: adminProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(rolesTeam).where(eq(rolesTeam.id, input.id));
    })
};
