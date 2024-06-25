import { TRPCError } from "@trpc/server";
import { and, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { IdInputSchema, TaskInputShema } from "~/lib/shared/types";
import {
  createTRPCRouter,
  protectedProcedure,
  teacherProcedure
} from "~/server/api/trpc";
import { tasks } from "~/server/db/schema";

export const tasksRouter = createTRPCRouter({
  create: teacherProcedure
    .input(TaskInputShema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(tasks).values({
        ...input,
        authorId: ctx.session.user.id
      });
    }),
  delete: teacherProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (
        !ctx.session.user.role.includes("ADMIN") ||
        !ctx.session.user.role.includes("LEAD_CYCLE_COMISSION")
      ) {
        const authorId = await ctx.db.query.tasks.findFirst({
          where: eq(tasks.id, input.id),
          columns: {
            authorId: true
          }
        });

        if (authorId?.authorId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Вы не можете удалять чужие задания"
          });
        }
      }

      await ctx.db.delete(tasks).where(eq(tasks.id, input.id));
    }),
  getAll: teacherProcedure
    .input(
      z
        .object({
          search: z.string().optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.tasks.findMany({
        where: and(
          input?.search ? ilike(tasks.name, `%${input.search}%`) : undefined,
          !ctx.session.user.role.includes("ADMIN") &&
            !ctx.session.user.role.includes("LEAD_CYCLE_COMISSION")
            ? eq(tasks.authorId, ctx.session.user.id)
            : undefined
        ),

        with: {
          author: {
            columns: {
              id: true,
              name: true,
              email: true
            }
          },
          subject: {
            columns: {
              id: true,
              name: true
            }
          },
          tutorial: {
            columns: {
              id: true,
              name: true
            }
          },
          group: {
            columns: {
              id: true,
              title: true
            }
          }
        }
      });
    }),
  update: teacherProcedure
    .input(z.intersection(IdInputSchema, TaskInputShema))
    .mutation(async ({ ctx, input }) => {
      if (
        !ctx.session.user.role.includes("ADMIN") ||
        !ctx.session.user.role.includes("LEAD_CYCLE_COMISSION")
      ) {
        const authorId = await ctx.db.query.tasks.findFirst({
          where: eq(tasks.id, input.id),
          columns: {
            authorId: true
          }
        });

        if (authorId?.authorId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Вы не можете редактировать чужие задания"
          });
        }
      }

      await ctx.db
        .update(tasks)
        .set({
          ...input
        })
        .where(eq(tasks.id, input.id));
    }),
  getOne: protectedProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.query.tasks.findFirst({
        where: eq(tasks.id, input.id),

        with: {
          author: {
            columns: {
              id: true,
              name: true,
              email: true
            }
          },
          subject: {
            columns: {
              id: true,
              name: true
            }
          },
          tutorial: {
            columns: {
              id: true,
              name: true
            }
          },
          group: {
            columns: {
              id: true,
              title: true
            }
          }
        }
      });
    })
});
