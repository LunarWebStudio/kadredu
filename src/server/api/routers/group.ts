import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { and, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { UploadFile } from "~/lib/server/file_upload";
import { ProcessImage } from "~/lib/server/images";
import { GroupInputSchema, IdInputSchema } from "~/lib/shared/types";

import { adminProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { groups, images } from "~/server/db/schema";

export const groupRouter = createTRPCRouter({
  create: adminProcedure
    .input(GroupInputSchema)
    .mutation(async ({ ctx, input }) => {
      let imageId: string | undefined = undefined
      await ctx.db.transaction(async tx => {
        try {
          const processed_image = await ProcessImage({
            imageB64: input.image,
            size: {
              width: 500,
              height: 500
            },
            fit: "contain"
          });

          const storageId = `group_${createId()}`
          await UploadFile(processed_image.file, storageId);

          imageId = (await tx.insert(images).values({
            blurPreview: processed_image.blurPreview,
            storageId
          }).returning())[0]!.id;
        } catch (err) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Не удалось загрузить фото группы"
          })
        }

        await tx.insert(groups).values({
          ...input,
          imageId
        });
      });
    }),
  update: adminProcedure
    .input(z.intersection(GroupInputSchema, IdInputSchema))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        let imageId: string | undefined = undefined
        if (input.image) {
          try {
            const processed_image = await ProcessImage({
              imageB64: input.image,
              size: {
                width: 500,
                height: 500
              },
              fit: "contain"
            });
            const storageId = `group_${input.title}`
            await UploadFile(processed_image.file, storageId);

            imageId = (await tx.insert(images).values({
              blurPreview: processed_image.blurPreview,
              storageId
            }).returning())[0]!.id;
          } catch (err) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Не удалось загрузить фото группы"
            })
          }
        }

        const group = await tx.update(groups).set({
          ...input,
          imageId
        }).where(eq(groups.id, input.id));

        if (!group) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Группа не найдена"
          })
        }
      })
    }),
  delete: adminProcedure.input(IdInputSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(groups).where(eq(groups.id, input.id));
  }),
  getAll: publicProcedure
    .input(z.object({
      buildingId: z.string().optional(),
      search: z.string().optional()
    }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.groups.findMany({
        where: and(
          input?.buildingId ? eq(groups.buildingId, input.buildingId) : undefined,
          input?.search ? ilike(groups.title, `%${input.search}%`) : undefined
        ),
        with: {
          building: true,
          image: true,
          users: {
            columns: {
              id: true
            }
          }
        }
      })
    }),
});
