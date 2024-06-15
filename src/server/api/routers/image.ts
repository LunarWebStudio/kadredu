import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { GetSignedUrl, UploadFile } from "~/lib/server/file_upload";
import { ProcessImage } from "~/lib/server/images";

import { createTRPCRouter, highLevelProcedure, publicProcedure } from "~/server/api/trpc";
import { images } from "~/server/db/schema";

export const imageRouter = createTRPCRouter({
  getPresignedURL: publicProcedure
    .input(
      z.object({
        key: z.string()
      })
    )
    .query(async ({ input }) => {
      return GetSignedUrl(input.key);
    }),
  upload: highLevelProcedure
    .input(z.object({
      image: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const processed_image = await ProcessImage({
        imageB64: input.image,
        size: {
          width: 1920,
        },
        fit: "contain"
      });

      const storageId = `image_${createId()}`
      await UploadFile(processed_image.file, storageId);
      return (await ctx.db.insert(images).values({
        storageId,
        blurPreview: processed_image.blurPreview,
      }).returning())[0]!;
    })
});
