import { eq } from "drizzle-orm";
import { RoleSchema } from "~/lib/shared/types/role";
import { IdSchema } from "~/lib/shared/types/utils";
import { adminProcedure, protectedProcedure } from "~/server/api/trpc";
import { teamRoles } from "~/server/db/schema";

export const teamRolesRouter = {
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return (await ctx.db.query.teamRoles.findMany()).reverse();
  }),
  create: adminProcedure.input(RoleSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(teamRoles).values(input);
  }),
  update: adminProcedure
    .input(RoleSchema.merge(IdSchema))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(teamRoles)
        .set({
          name: input.name,
        })
        .where(eq(teamRoles.id, input.id));
    }),
  delete: adminProcedure.input(IdSchema).mutation(({ ctx, input }) => {
    return ctx.db.delete(teamRoles).where(eq(teamRoles.id, input.id));
  }),
};
