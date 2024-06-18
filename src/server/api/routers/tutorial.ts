import { eq, and, ilike } from "drizzle-orm";
import { z } from "zod";
import { TutorialInputShema, IdInputSchema } from "~/lib/shared/types";
import { adminProcedure, createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import { images, tutorials, users} from "~/server/db/schema";
import { ProcessImage } from "~/lib/server/images";
import { createId } from "@paralleldrive/cuid2";
import { UploadFile } from "~/lib/server/file_upload";
import { TRPCError } from "@trpc/server";

export const tutorialsRouter = createTRPCRouter ({
    create: adminProcedure
        .input(TutorialInputShema)
        .mutation(async ({ctx, input}) => {
            
            let imageId: string | undefined = undefined
            await ctx.db.transaction(async tx => {
              try {
                const processed_image = await ProcessImage({
                  imageB64: input.imageId,
                  size: {
                    width: 100,
                    height: 200
                  },
                  fit: "contain"
                });
      
                const storageId = `tutorial_${createId()}`
                await UploadFile(processed_image.file, storageId);
      
                imageId = (await tx.insert(images).values({
                  blurPreview: processed_image.blurPreview,
                  storageId
                }).returning())[0]!.id;
              } catch (err) {
                console.error(err)
                throw new TRPCError({
                  code: "BAD_REQUEST",
                  message: "Не удалось загрузить фото туториала"
                })
              }
      
              await tx.insert(tutorials).values({
                ...input,
                imageId,
                authorId: ctx.session.user.id
              });
            });
        }),
    delete: adminProcedure
        .input(IdInputSchema)
        .mutation(async ({ctx, input}) => {
            await ctx.db.delete(tutorials).where(eq(tutorials.id, input.id))
        }),
    getAll: publicProcedure
        .input(z.object({
            search: z.string().optional()
        }).optional())

        .query(async ({ ctx, input }) => {
            return await ctx.db.query.tutorials.findMany({
              where: and(
                input?.search ? ilike(tutorials.name, `%${input.search}%`) : undefined
              ), 

              with: {
                author: true,
                subject: true,      
                image: true
              }
            })
        }),
    update: adminProcedure
        .input(z.intersection(IdInputSchema, TutorialInputShema))
        .mutation(async ({ctx, input}) => {
          await ctx.db.transaction(async (tx) => {
            let imageId: string | undefined = undefined
            if (input.imageId) {
              try {
                const processed_image = await ProcessImage({
                  imageB64: input.imageId,
                  size: {
                    width: 500,
                    height: 500
                  },
                  fit: "contain"
                });
                const storageId = `tutorial_${input.name}`
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
            await tx.update(tutorials).set({
              ...input,
              imageId
            }).where(eq(tutorials.id, input.id));
          })
        }),
    getOne: adminProcedure
        .input(IdInputSchema)
        .mutation(async ({ctx, input}) => {
          return await ctx.db.query.tutorials.findFirst({
            where: eq(tutorials.id, input.id),

            with: {
              author: {
                  columns: {
                      id: true,
                      name: true,
                      email: true
                  }
              },
              image: true
            }
        })
      }),
    getByUserId: publicProcedure
      .input(IdInputSchema)
      .mutation(async ({ ctx }) => {
        return await ctx.db.query.tutorials.findMany({
          where: eq(tutorials.authorId, users.id)
        })
      })
})