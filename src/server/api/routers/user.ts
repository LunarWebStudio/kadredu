import { eq } from "drizzle-orm";
import { z } from "zod";
import { UploadFile } from "~/lib/server/file_upload";
import { ProcessImage } from "~/lib/server/images";

import { createTRPCRouter, protectedProcedure, verificationProcedure } from "~/server/api/trpc";
import { images, users } from "~/server/db/schema";
import { DESCRIPTION_LIMIT, MAX_PROFILE_PICTURE_SIZE, NAME_LIMIT } from "~/lib/shared/const";
import { TRPCError } from "@trpc/server";

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
    })
});
