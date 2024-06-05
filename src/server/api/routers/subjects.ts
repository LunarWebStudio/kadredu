import { IdInputSchema, SubjectInputSchema } from "~/lib/shared/types";
import {
  leadCycleComissionProcedure,
  publicProcedure
} from "~/server/api/trpc";
import { and, arrayContains, eq, ilike, or } from "drizzle-orm";
import { subjects, users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const subjectsRouter = {
  getAll: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional()
        })
        .optional()
    )
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db.query.subjects.findMany({
          where: input?.search
            ? ilike(subjects.name, `%${input.search}%`)
            : undefined,
          with: {
            teacherInfo: {
              columns: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        })
      ).reverse();
    }),

  create: leadCycleComissionProcedure
    .input(SubjectInputSchema)
    .mutation(async ({ ctx, input }) => {
      const teacher = await ctx.db.query.users.findFirst({
        where: and(
          eq(users.id, input.teacherId),
          or(
            arrayContains(users.role, ["LEAD_CYCLE_COMISSION"]),
            arrayContains(users.role, ["TEACHER"])
          )
        )
      });
      console.log(teacher);
      if (!teacher) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Преподаватель не найден"
        });
      }
      return await ctx.db.insert(subjects).values({
        name: input.name,
        teacherId: teacher.id
      });
    }),

  update: leadCycleComissionProcedure
    .input(z.intersection(IdInputSchema, SubjectInputSchema))
    .mutation(async ({ ctx, input }) => {
      const existSubject = await ctx.db.query.subjects.findFirst({
        where: eq(subjects.id, input.id)
      });
      if (!existSubject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Предмет не найден"
        });
      }
      if (existSubject.id === input.teacherId) {
        return await ctx.db
          .update(subjects)
          .set({ name: input.name })
          .where(eq(subjects.id, input.id));
      }
      const existTeacher = await ctx.db.query.users.findFirst({
        where: and(
          eq(users.id, input.teacherId),
          or(
            arrayContains(users.role, ["LEAD_CYCLE_COMISSION"]),
            arrayContains(users.role, ["TEACHER"])
          )
        )
      });
      if (!existTeacher) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Преподаватель не найден"
        });
      }
      return await ctx.db
        .update(subjects)
        .set({ name: input.name, teacherId: existTeacher.id })
        .where(eq(subjects.id, input.id));
    }),

  delete: leadCycleComissionProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(subjects).where(eq(subjects.id, input.id));
    })
};
