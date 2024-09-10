import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { and, eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";
import { UploadFile } from "~/lib/server/file_upload";
import { ProcessImage } from "~/lib/server/images";
import { IdInputSchema, TutorialInputShema } from "~/lib/shared/types";
import {
  createTRPCRouter,
  highLevelProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { images, purshases, tutorials, users } from "~/server/db/schema";

export const tutorialsRouter = createTRPCRouter({
  create: highLevelProcedure
    .input(TutorialInputShema)
    .mutation(async ({ ctx, input }) => {
      let imageId: string | undefined = undefined;
      await ctx.db.transaction(async (tx) => {
        try {
          const processed_image = await ProcessImage({
            imageB64: input.imageId,
            size: {
              width: 100,
              height: 200,
            },
            fit: "contain",
          });

          const storageId = `tutorial_${createId()}`;
          await UploadFile(processed_image.file, storageId);

          imageId = (
            await tx
              .insert(images)
              .values({
                blurPreview: processed_image.blurPreview,
                storageId,
              })
              .returning()
          )[0]!.id;
        } catch (err) {
          console.error(err);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Не удалось загрузить фото туториала",
          });
        }

        await tx.insert(tutorials).values({
          ...input,
          imageId,
          authorId: ctx.session.user.id,
        });
      });
    }),
  delete: highLevelProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.role.includes("ADMIN")) {
        const authorId = await ctx.db.query.tutorials.findFirst({
          where: eq(tutorials.id, input.id),
        });
        if (authorId?.authorId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Недостаточно прав для данного действия",
          });
        }
      }

      await ctx.db.delete(tutorials).where(eq(tutorials.id, input.id));
    }),
  getAll: highLevelProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
        })
        .optional(),
    )

    .query(async ({ ctx, input }) => {
      return await ctx.db.query.tutorials.findMany({
        where: and(
          input?.search
            ? ilike(tutorials.name, `%${input.search}%`)
            : undefined,
          ctx.session.user.role.includes("ADMIN")
            ? undefined
            : eq(tutorials.authorId, ctx.session.user.id),
        ),

        with: {
          author: true,
          subject: true,
          image: true,
          topic: true,
        },
      });
    }),
  update: highLevelProcedure
    .input(z.intersection(IdInputSchema, TutorialInputShema))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.role.includes("ADMIN")) {
        const authorId = await ctx.db.query.tutorials.findFirst({
          where: eq(tutorials.id, input.id),
        });
        if (authorId?.authorId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Недостаточно прав для данного действия",
          });
        }
      }

      await ctx.db.transaction(async (tx) => {
        let imageId: string | undefined = undefined;
        if (input.imageId) {
          try {
            const processed_image = await ProcessImage({
              imageB64: input.imageId,
              size: {
                width: 500,
                height: 500,
              },
              fit: "contain",
            });
            const storageId = `tutorial_${input.name}`;
            await UploadFile(processed_image.file, storageId);

            imageId = (
              await tx
                .insert(images)
                .values({
                  blurPreview: processed_image.blurPreview,
                  storageId,
                })
                .returning()
            )[0]!.id;
          } catch (_err) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Не удалось загрузить фото группы",
            });
          }
        }
        await tx
          .update(tutorials)
          .set({
            ...input,
            imageId,
          })
          .where(eq(tutorials.id, input.id));
      });
    }),
  // TODO: проверить покупку
  getOne: protectedProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const purshase = await ctx.db.query.purshases.findFirst({
        where: eq(purshases.productId, input.id),
      });
      if (!purshase) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Нет доступа",
        });
      }
      return await ctx.db.query.tutorials.findFirst({
        where: eq(tutorials.id, input.id),

        with: {
          author: {
            columns: {
              id: true,
              name: true,
              email: true,
            },
          },
          topic: true,
          image: true,
        },
      });
    }),
  buyOne: protectedProcedure
    .input(IdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const existTutor = await ctx.db.query.tutorials.findFirst({
        where: eq(tutorials.id, input.id),
      });
      if (!existTutor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Туториал не найден",
        });
      }
      await ctx.db.transaction(async (tx) => {
        if (ctx.session.user.coins - existTutor.price < 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Недостаточно монет",
          });
        }
        await tx
          .update(users)
          .set({
            coins: sql`${users.coins} - ${existTutor.price}`,
          })
          .where(eq(users.id, ctx.session.user.id));

        await tx.insert(purshases).values({
          productId: existTutor.id,
          userId: ctx.session.user.id,
          price: existTutor.price,
        });
      });
    }),
});
