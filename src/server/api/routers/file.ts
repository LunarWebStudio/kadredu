import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { FileSchema } from "~/lib/shared/types/file";
import { IdSchema } from "~/lib/shared/types/utils";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  teacherProcedure,
} from "~/server/api/trpc";
import { files } from "~/server/db/schema";

export const fileRouter = createTRPCRouter({
  create: teacherProcedure
    .input(FileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id } = (
          await ctx.db
            .insert(files)
            .values({
              ...input,
              objectId: await ctx.s3.upload(input),
            })
            .returning()
        )[0]!;

        return {
          id,
        };
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Ошибка загрузки файла",
        });
      }
    }),
  get: protectedProcedure.input(IdSchema).query(async ({ ctx, input }) => {
    const file = await ctx.db.query.files.findFirst({
      where: eq(files.id, input.id),
    });

    if (!file) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Файл не найден",
      });
    }

    const presignedUrl = await ctx.s3.getSignedUrl(file.objectId);

    return {
      presignedUrl,
      objectId: file.objectId,
      contentType: file.contentType,
      fileName: file.fileName,
      fileSize: file.fileSize,
    };
  }),
});
