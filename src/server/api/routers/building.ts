import { eq } from "drizzle-orm";
import { BuildingSchema } from "~/lib/shared/types/building";
import { IdSchema } from "~/lib/shared/types/utils";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { buildings } from "~/server/db/schema";

export const buildingRouter = createTRPCRouter({
  create: adminProcedure.input(BuildingSchema).mutation(({ ctx, input }) => {
    return ctx.db.insert(buildings).values({
      ...input,
      createdById: ctx.session.user.id,
    });
  }),
  update: adminProcedure
    .input(BuildingSchema.merge(IdSchema))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(buildings)
        .set(input)
        .where(eq(buildings.id, input.id));
    }),
  delete: adminProcedure.input(IdSchema).mutation(({ ctx, input }) => {
    return ctx.db.delete(buildings).where(eq(buildings.id, input.id));
  }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.buildings.findMany({
      with: {
        groups: {
          columns: {
            id: true,
          },
        },
      },
    });
  }),
});
