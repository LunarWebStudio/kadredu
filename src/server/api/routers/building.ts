import { eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { BuildingInputSchema, IdInputSchema } from "~/lib/shared/types";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure
} from "~/server/api/trpc";
import { buildings } from "~/server/db/schema";

export const buildingRouter = createTRPCRouter({
  create: adminProcedure
    .input(BuildingInputSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(buildings).values({
        ...input,
        createdById: ctx.session.user.id
      });
    }),
  update: adminProcedure
    .input(z.intersection(IdInputSchema, BuildingInputSchema))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(buildings)
        .set(input)
        .where(eq(buildings.id, input.id));
    }),
  delete: adminProcedure.input(IdInputSchema).mutation(({ ctx, input }) => {
    return ctx.db.delete(buildings).where(eq(buildings.id, input.id));
  }),
  getAll: publicProcedure
    .input(z.object({
      search: z.string().optional()
    }).optional())
    .query(({ ctx, input }) => {
      return ctx.db.query.buildings.findMany({
        where: input?.search ? or(
          ilike(buildings.title, `%${input.search}%`),
          ilike(buildings.address, `%${input.search}%`)
        ) : undefined,
        with: {
          groups: {
            columns: {
              id: true
            }
          }
        }
      });
    })
});
