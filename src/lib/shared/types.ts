import type { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import { day } from "~/lib/shared/time";
import type { AppRouter } from "~/server/api/root";
import { statusSchema } from "~/server/db/schema";
import { ExperienceInputSchema } from "./types/utils";

export const IdInputSchema = z.object({
  id: z
    .string({
      required_error: "ID не указан",
      invalid_type_error: "ID не является строкой",
    })
    .min(1, "ID не заполнен")
    .max(255, "ID слишком длинный"),
});
