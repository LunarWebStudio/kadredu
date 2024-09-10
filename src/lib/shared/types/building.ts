import type { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import type { AppRouter } from "~/server/api/root";

export type Building = inferProcedureOutput<
  AppRouter["building"]["getAll"]
>[number];

export const BuildingSchema = z.object({
  name: z
    .string({
      required_error: "Название не заполнено",
      invalid_type_error: "Название не является строкой",
    })
    .min(1, "Название не заполнено")
    .max(255, "Название слишком длинное"),
  address: z
    .string({
      required_error: "Адрес не заполнен",
      invalid_type_error: "Адрес не является строкой",
    })
    .min(1, "Адрес не заполнен")
    .max(255, "Адрес слишком длинный"),
});
