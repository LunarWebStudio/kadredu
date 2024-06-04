import { and, arrayContains, eq, ilike, inArray, isNotNull, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { UploadFile } from "~/lib/server/file_upload";
import { ProcessImage } from "~/lib/server/images";

import { createTRPCRouter, protectedProcedure, teacherProcedure, verificationProcedure } from "~/server/api/trpc";
import { images, roleSchema, users } from "~/server/db/schema";
import { DESCRIPTION_LIMIT, MAX_PROFILE_PICTURE_SIZE, NAME_LIMIT } from "~/lib/shared/const";
import { TRPCError } from "@trpc/server";
import { IdInputSchema } from "~/lib/shared/types";
import { env } from "~/env";

export const userRouter = createTRPCRouter({
  updadeSelf: verificationProcedure
    .input(
      z.object({
        name: z
          .string({
            required_error: "ФИО не заполнено",
            invalid_type_error: "ФИО не является строкой"
          })
          .min(1, "ФИО не заполнено")
          .max(NAME_LIMIT)
          .optional(),
        description: z
          .string({
            required_error: "Описание не заполнено",
            invalid_type_error: "Описание не является строкой"
          })
          .max(DESCRIPTION_LIMIT)
          .optional(),
        profilePictureImage: z
          .string({
            required_error: "Фото не выбрано",
            invalid_type_error: "Фото не является строкой"
          })
          .max(MAX_PROFILE_PICTURE_SIZE, "Фото слишком большое")
          .optional()
      })
    )
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
        }).where(eq(users.id, ctx.session.user.id));
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
      }).where(eq(users.id, ctx.session.user.id));
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
    })
});
