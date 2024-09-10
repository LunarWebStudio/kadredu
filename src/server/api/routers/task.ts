import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { TaskInputShema } from "~/lib/shared/types/task";
import { IdSchema } from "~/lib/shared/types/utils";
import {
  createTRPCRouter,
  protectedProcedure,
  teacherProcedure,
} from "~/server/api/trpc";
import { taskToGroups, tasks } from "~/server/db/schema";

export const tasksRouter = createTRPCRouter({
  create: teacherProcedure
    .input(TaskInputShema)
    .mutation(async ({ ctx, input }) => {
      const { id: taskId } = (
        await ctx.db
          .insert(tasks)
          .values({
            ...input,
            authorId: ctx.session.user.id,
          })
          .returning({ id: tasks.id })
      )[0]!;

      await ctx.db.insert(taskToGroups).values(
        input.groupIds.map((groupId) => ({
          taskId,
          groupId,
        })),
      );
    }),
  update: teacherProcedure
    .input(TaskInputShema.merge(IdSchema))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.query.tasks.findFirst({
        where: and(eq(tasks.id, input.id)),
        columns: {},
        with: {
          subject: true,
        },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Задание не найдено",
        });
      }

      if (task.subject.teacherId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Недостаточно прав для данного действия",
        });
      }

      await ctx.db.transaction(async (trx) => {
        await trx.delete(taskToGroups).where(eq(taskToGroups.taskId, input.id));

        await trx.update(tasks).set(input).where(eq(tasks.id, input.id));
        await trx.insert(taskToGroups).values(
          input.groupIds.map((groupId) => ({
            taskId: input.id,
            groupId,
          })),
        );
      });
    }),
  getAll: teacherProcedure.input(IdSchema).query(({ ctx, input }) => {
    return ctx.db.query.tasks.findMany({
      where: eq(tasks.subjectId, input.id),
      columns: {
        id: true,
        name: true,
        deadline: true,
        coins: true,
        experience: true,
      },
    });
  }),
  getOne: protectedProcedure.input(IdSchema).query(async ({ ctx, input }) => {
    const task = await ctx.db.query.tasks.findFirst({
      where: eq(tasks.id, input.id),
      with: {
        groups: {
          columns: {
            groupId: true,
          },
        },
      },
    });

    if (!task) {
      return null;
    }

    return {
      ...task,
      groupIds: task.groups.map((g) => g.groupId),
    };
  }),
});
