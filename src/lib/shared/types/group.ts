import type { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import type { AppRouter } from "~/server/api/root";
import { FileSchema } from "./file";

export type Group = inferProcedureOutput<AppRouter["group"]["getAll"]>[number];

export const GroupSchema = z.object({
  name: z
    .string({
      required_error: "Название не заполнено",
      invalid_type_error: "Название не является строкой",
    })
    .min(1, "Название не заполнено")
    .max(255, "Название слишком длинное"),
  image: FileSchema.extend({
    id: z.string().optional(),
    b64: z.string({}).optional(),
  }),
  buildingId: z
    .string({
      required_error: "Не указан ID СП",
      invalid_type_error: "ID СП не является строкой",
    })
    .min(1, "ID СП не заполнен")
    .max(255, "ID СП слишком длинный"),
});
