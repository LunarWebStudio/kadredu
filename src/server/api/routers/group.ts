import { eq } from "drizzle-orm";
import { GroupSchema } from "~/lib/shared/types/group";

import { TRPCError } from "@trpc/server";
import { IdSchema } from "~/lib/shared/types/utils";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { groups } from "~/server/db/schema";
import { createCaller } from "../root";

export const groupRouter = createTRPCRouter({
  create: adminProcedure.input(GroupSchema).mutation(async ({ ctx, input }) => {
    const caller = createCaller(ctx);
    const { id } = await caller.file.create({
      ...input.image,
      b64: input.image.b64!,
    });
    await ctx.db.insert(groups).values({
      ...input,
      imageId: id,
    });
  }),
  update: adminProcedure
    .input(GroupSchema.merge(IdSchema))
    .mutation(async ({ ctx, input }) => {
      let id: string | undefined;
      if (input.image.b64 !== undefined) {
        const caller = createCaller(ctx);
        ({ id } = await caller.file.create({
          ...input.image,
          b64: input.image.b64!,
        }));
      }

      await ctx.db
        .update(groups)
        .set({
          ...input,
          imageId: id,
        })
        .where(eq(groups.id, input.id));
    }),
  delete: adminProcedure.input(IdSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(groups).where(eq(groups.id, input.id));
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.groups.findMany({
      with: {
        building: true,
        image: true,
        users: {
          columns: {
            id: true,
          },
        },
      },
    });
  }),
});
