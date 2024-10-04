import { and, arrayContains, eq } from "drizzle-orm";
import { z } from "zod";

import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import { IdInputSchema } from "~/lib/shared/types";
import {
  CoinsInputSchema,
  UserUpdateSchema,
  UsernameSchema,
} from "~/lib/shared/types/user";
import { ExperienceInputSchema } from "~/lib/shared/types/utils";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  teacherProcedure,
} from "~/server/api/trpc";
import { roleSchema, users } from "~/server/db/schema";
import { createCaller } from "../root";

export const userRouter = createTRPCRouter({
  session: protectedProcedure.query(async ({ ctx }) => ({
    session: ctx.session,
  })),
  completeOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .update(users)
      .set({ onboarding: true })
      .where(eq(users.id, ctx.session.user.id));
  }),
  updateSelf: protectedProcedure
    .input(UserUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      let imageId: string | undefined = undefined;
      if (input.image && !input.image.id && input.image.b64) {
        const caller = createCaller(ctx);
        ({ id: imageId } = await caller.file.create({
          ...input.image,
          b64: input.image.b64!,
        }));
      }

      await ctx.db
        .update(users)
        .set({
          ...input,
          imageId,
        })
        .where(eq(users.id, ctx.session.user.id));
    }),
  getAll: teacherProcedure
    .input(
      z
        .object({
          role: roleSchema,
        })
        .optional(),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.users.findMany({
        where: arrayContains(users.roles, [input?.role ?? "UNKNOWN"]).if(
          input?.role,
        ),
        with: {
          image: true,
          group: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });
    }),
  updateGroup: teacherProcedure
    .input(
      z.intersection(
        IdInputSchema,
        z.object({
          groupId: z
            .string({
              required_error: "Не указан ID группы",
              invalid_type_error: "ID группы не является строкой",
            })
            .min(1, "ID группы не заполнен")
            .max(255, "ID группы слишком длинный"),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({
            groupId: input.groupId,
          })
          .where(eq(users.id, input.id));
      });
    }),
  updateRoles: teacherProcedure
    .input(
      z.intersection(
        IdInputSchema,
        z.object({
          roles: roleSchema.array(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      if (
        input.roles.some((role) => role !== "STUDENT") &&
        !ctx.session.user.roles.includes("ADMIN")
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Недостаточно прав для этого действия",
        });
      }
      await ctx.db
        .update(users)
        .set({
          roles: input.roles,
        })
        .where(eq(users.id, input.id));
    }),
  delete: teacherProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
        columns: {
          email: true,
          roles: true,
        },
      });

      if (user?.email === env.MAIN_ADMIN_EMAIL) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Нельзя удалить главного администратора",
        });
      }

      if (
        ctx.session.user.roles.some((r) => r !== "ADMIN") &&
        user?.roles.every((r) => r !== "STUDENT")
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Недостаточно прав для этого действия",
        });
      }

      await ctx.db.delete(users).where(eq(users.id, input.id));
    }),
  getOne: protectedProcedure.input(UsernameSchema).query(({ ctx, input }) => {
    return ctx.db.query.users.findFirst({
      where: and(eq(users.username, input.username), eq(users.verified, true)),
      with: {
        group: {
          columns: {
            id: true,
            imageId: true,
            name: true,
          },
          with: {
            building: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
      columns: {
        id: true,
        name: true,
        username: true,
        description: true,
        githubUsername: true,
        imageId: true,
        experiencePoints: true,
        coins: true,
      },
    });
  }),
  grantCoins: adminProcedure
    .input(z.intersection(IdInputSchema, CoinsInputSchema))
    .mutation(async ({ ctx, input }) => {
      const coins = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
        columns: {
          coins: true,
        },
      });

      if (!coins) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Пользователь не найден",
        });
      }

      await ctx.db
        .update(users)
        .set({
          coins: coins?.coins + input.coins,
        })
        .where(eq(users.id, ctx.session.user.id));
    }),
  grantExperience: adminProcedure
    .input(z.intersection(IdInputSchema, ExperienceInputSchema))
    .mutation(async ({ ctx, input }) => {
      const experience = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
        columns: {
          experiencePoints: true,
        },
      });

      if (!experience) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Пользователь не найден",
        });
      }

      await ctx.db
        .update(users)
        .set({
          experiencePoints: experience?.experiencePoints + input.experience,
        })
        .where(eq(users.id, ctx.session.user.id));
    }),
});
