import type { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import type { AppRouter } from "~/server/api/root";

export type Topic = inferProcedureOutput<AppRouter["topic"]["getAll"]>[number];

export const TopicSchema = z.object({
  name: z
    .string({
      required_error: "Название не указано",
      invalid_type_error: "Название не является строкой",
    })
    .min(1, "Название темы не указано")
    .max(255, "Название темы слишком длинное"),
});
