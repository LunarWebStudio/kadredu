import { and, arrayContains, eq, ilike, inArray, isNotNull, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { UploadFile } from "~/lib/server/file_upload";
import { ProcessImage } from "~/lib/server/images";

import { adminProcedure, createTRPCRouter, protectedProcedure, teacherProcedure, verificationProcedure } from "~/server/api/trpc";
import { images, roleSchema, users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { IdInputSchema, UserUpdateInputSchema, UsernameInputSchema, CoinsInputSchema } from "~/lib/shared/types";

import { env } from "~/env";

export const userRouter = createTRPCRouter({
  updadeSelf: verificationProcedure
    .input(UserUpdateInputSchema) 
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        let imageId: string | undefined = undefined
        if (input.profilePictureImage) {
          try {
            const processed_image = await ProcessImage({
              imageB64: input.profilePictureImage
            });
            const storageId = `profile_picture_${ctx.session.user.id}`
            await UploadFile(processed_image.file, storageId);

            imageId = (await tx.insert(images).values({
              blurPreview: processed_image.blurPreview,
              storageId
            }).returning())[0]!.id;
          } catch (err) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Не удалось загрузить фото профиля"
            })
          }
        }

        await tx.update(users).set({
          name: input.name,
          username:input.username,
          description: input.description,
          profilePictureId: imageId
        }).where(eq(users.id, ctx.session.user.id));
      })
    }),
  completeOnboarding: protectedProcedure
    .mutation(async ({ ctx }) => {
      await ctx.db
        .update(users)
        .set({ onboarding: true })
        .where(eq(users.id, ctx.session.user.id));
    }),
  getAll: teacherProcedure
    .input(z.object({
      roles: roleSchema.array().optional(),
      groupIds: z.string().array().optional(),
      search: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.users.findMany({
        where: and(
          isNotNull(users.name),
          input?.search ? or(
            ilike(users.name, `%${input.search}%`),
            ilike(users.email, `%${input.search}%`),
            ilike(users.username, `%${input.search}%`)
          ) : undefined,
          or(
            input?.roles ? arrayContains(users.role, input.roles) : undefined,
            input?.roles?.includes("UNKNOWN") ? eq(users.role, []) : undefined,
          ),
          or(
            input?.groupIds ? inArray(users.groupId, input.groupIds) : undefined,
            input?.groupIds?.includes("unknown") ? isNull(users.groupId) : undefined,
          )
        ),
        with: {
          profilePicture: true,
          group: {
            columns: {
              id: true,
              title: true
            }
          }
        }
      });
    }),
  updateGroup: teacherProcedure
    .input(
      z.intersection(IdInputSchema, z.object({
        groupId: z.string({
          required_error: "Не указан ID группы",
          invalid_type_error: "ID группы не является строкой"
        }).min(1, "ID группы не заполнен")
          .max(255, "ID группы слишком длинный")
      }))
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx.update(users).set({
          groupId: input.groupId
        }).where(eq(users.id, input.id));
      })
    }),
  updateRoles: teacherProcedure
    .input(
      z.intersection(IdInputSchema, z.object({
        roles: roleSchema.array()
      }))
    )
    .mutation(async ({ ctx, input }) => {
      if (input.roles.some((role) => role !== "STUDENT") && !ctx.session.user.role.includes("ADMIN")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Недостаточно прав для этого действия"
        })
      }
      await ctx.db.update(users).set({
        role: input.roles
      }).where(eq(users.id, input.id));
    }),
  delete: teacherProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
        columns: {
          email: true,
          role: true
        }
      });

      if (user?.email === env.MAIN_ADMIN_EMAIL) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Нельзя удалить главного администратора"
        })
      }

      if (
        ctx.session.user.role.some((r) => r !== "ADMIN") &&
        user?.role.every((r) => r !== "STUDENT")
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Недостаточно прав для этого действия"
        })
      }

      await ctx.db.delete(users).where(eq(users.id, input.id));
    }),
  getOne: protectedProcedure
    .input(UsernameInputSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.users.findFirst({
        where: and(
          eq(users.username, input.username),
          eq(users.verified, true)
        ),
        with: {
          profilePicture: true,
          group: true
        },
        columns: {
          id: true,
          name: true,
          username: true,
        }
      });
    }),
  grantCoins: adminProcedure
    .input(z.intersection(IdInputSchema, CoinsInputSchema))
    .mutation(async ({ ctx, input }) => {
      const coins = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
        columns: {
          coins: true
        }
      })

      if (!coins) {
        throw new TRPCError({ 
          code: "NOT_FOUND",
          message: "Пользователь не найден"
        })
      }

      await ctx.db.update(users).set({
        coins: coins?.coins + input.coins
      }).where(eq(users.id, ctx.session.user.id));
    })
});
