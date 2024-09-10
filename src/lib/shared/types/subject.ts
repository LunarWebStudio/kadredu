import type { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import type { AppRouter } from "~/server/api/root";

export const SubjectSchema = z.object({
  name: z
    .string({
      message: "Название предмета не указанно",
    })
    .min(1, "Название не может быть пустым")
    .max(255, "Название слишком длинное"),
  teacherId: z
    .string({
      message: "Преподаватель не указан",
    })
    .min(1, "ID преподавателя не заполнен")
    .max(255, "ID преподавателя слишком длинный"),
  buildingId: z
    .string({
      message: "ID СП не указан",
    })
    .min(1, "ID СП не заполнен")
    .max(255, "ID СП слишком длинный"),
});

export type Subject = inferProcedureOutput<
  AppRouter["subject"]["getAll"]
>[number];
