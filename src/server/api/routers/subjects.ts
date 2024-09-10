import { eq } from "drizzle-orm";
import { z } from "zod";
import { IdInputSchema } from "~/lib/shared/types";
import { SubjectSchema } from "~/lib/shared/types/subject";
import { IdSchema } from "~/lib/shared/types/utils";
import {
  leadCycleComissionProcedure,
  protectedProcedure,
  teacherProcedure,
} from "~/server/api/trpc";
import { groups, subjects, users } from "~/server/db/schema";

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
  getAssigned: teacherProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.subjects.findMany({
      where: eq(subjects.teacherId, ctx.session.user.id),
      with: {
        building: {
          columns: {},
          with: {
            groups: {
              columns: {
                id: true,
                name: true,
              },
              with: {
                image: true,
              },
            },
          },
        },
      },
    });
  }),
  getGroups: teacherProcedure.input(IdSchema).query(({ ctx, input }) => {
    return ctx.db.query.subjects.findFirst({
      where: eq(subjects.id, input.id),
      with: {
        building: {
          columns: {},
          with: {
            groups: {
              columns: {
                id: true,
                name: true,
              },
              with: {
                image: true,
                students: {
                  columns: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }),
  getStudents: teacherProcedure
    .input(
      IdSchema.merge(
        z.object({
          groupId: z.string(),
        }),
      ),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.subjects.findFirst({
        where: eq(subjects.id, input.id),
        with: {
          building: {
            columns: {},
            with: {
              groups: {
                where: eq(groups.id, input.groupId),
                columns: {
                  id: true,
                  name: true,
                },
                with: {
                  image: true,
                  students: {
                    where: eq(users.groupId, input.groupId),
                    columns: {
                      id: true,
                      name: true,
                    },
                    with: {
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }),
  getOne: protectedProcedure.input(IdSchema).query(({ ctx, input }) => {
    return ctx.db.query.subjects.findFirst({
      where: eq(subjects.id, input.id),
      columns: {
        id: true,
        name: true,
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
