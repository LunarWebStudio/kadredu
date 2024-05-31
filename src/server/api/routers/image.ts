import { z } from "zod";
import { GetSignedUrl } from "~/lib/server/file_upload";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
  getPresignedURL: publicProcedure
    .input(
      z.object({
        key: z.string()
      })
    )
    .query(async ({ input }) => {
      return GetSignedUrl(input.key);
    })
});
