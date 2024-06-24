import { eq, and, ilike } from "drizzle-orm";
import { z } from "zod";
import { EventInputShema, IdInputSchema } from "~/lib/shared/types";
import { adminProcedure, createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import { images, events } from "~/server/db/schema";
import { ProcessImage } from "~/lib/server/images";
import { UploadFile } from "~/lib/server/file_upload";
import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";

export const eventRouter = createTRPCRouter ({
    create: adminProcedure
        .input(EventInputShema)
        .mutation(async ({ctx, input}) => {
            let imageId: string | undefined = undefined
            await ctx.db.transaction(async tx => {
              try {
                const processed_image = await ProcessImage({
                  imageB64: input.imageId,
                  size: {
                    width: 1920,
                    height: 1080
                  },
                  fit: "contain"
                });
      
                const storageId = `event_${createId()}`
                await UploadFile(processed_image.file, storageId);
      
                imageId = (await tx.insert(images).values({
                  blurPreview: processed_image.blurPreview,
                  storageId
                }).returning())[0]!.id;
              } catch (err) {
                console.error(err)
                throw new TRPCError({
                  code: "BAD_REQUEST",
                  message: "Не удалось загрузить фото мероприятия"
                })
              }
      
              await tx.insert(events).values({
                ...input,
                imageId
              });
            });
        }),
    delete: adminProcedure
        .input(IdInputSchema)
        .mutation(async ({ctx, input}) => {
            await ctx.db.delete(events).where(eq(events.id, input.id))
        }),
    getAll: publicProcedure
        .input(z.object({
            search: z.string().optional()
        }).optional())

        .query(async ({ ctx, input }) => {
            return await ctx.db.query.events.findMany({
              where: and(
                input?.search ? ilike(events.name, `%${input.search}%`) : undefined
              ), 

              with: {
                type: true,
                group: true,
                image: true
              }
            })
        }),
    update: adminProcedure
        .input(z.intersection(IdInputSchema, EventInputShema))
        .mutation(async ({ctx, input}) => {
            await ctx.db.transaction(async (tx) => {
                let imageId: string | undefined = undefined
                if (input.imageId) {
                  try {
                    const processed_image = await ProcessImage({
                      imageB64: input.imageId,
                      size: {
                        width: 1920,
                        height: 1080
                      },
                      fit: "contain"
                    });
                    const storageId = `event_${input.name}`
                    await UploadFile(processed_image.file, storageId);
        
                    imageId = (await tx.insert(images).values({
                      blurPreview: processed_image.blurPreview,
                      storageId
                    }).returning())[0]!.id;
                  } catch (err) {
                    throw new TRPCError({
                      code: "BAD_REQUEST",
                      message: "Не удалось загрузить фото мероприятия"
                    })
                  }
                }
                await tx.update(events).set({
                  ...input,
                  imageId
                }).where(eq(events.id, input.id));
              })
        }),
    getOne: adminProcedure
        .input(IdInputSchema)
        .mutation(async ({ctx, input}) => {
          return await ctx.db.query.events.findFirst({
            where: eq(events.id, input.id),

            with: {
                type: true,
                group: true,
                image: true
            }
        })
      })
})