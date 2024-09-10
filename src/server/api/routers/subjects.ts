import { TRPCError } from "@trpc/server";
import { and, arrayContains, eq, or } from "drizzle-orm";
import { IdInputSchema } from "~/lib/shared/types";
import { SubjectSchema } from "~/lib/shared/types/subject";
import { IdSchema } from "~/lib/shared/types/utils";
import {
  leadCycleComissionProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { subjects, users } from "~/server/db/schema";

export const subjectsRouter = {
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.subjects.findMany({
      with: {
        building: {
          columns: {
            name: true,
          },
        },
        teacher: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }),

  create: leadCycleComissionProcedure
    .input(SubjectSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(subjects).values(input);
    }),

  update: leadCycleComissionProcedure
    .input(SubjectSchema.merge(IdSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(subjects)
        .set({
          ...input,
          id: undefined,
        })
        .where(eq(subjects.id, input.id));
    }),
  delete: leadCycleComissionProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(subjects).where(eq(subjects.id, input.id));
    }),
};
