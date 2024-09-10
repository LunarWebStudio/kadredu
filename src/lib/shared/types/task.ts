import { z } from "zod";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { day } from "../time";
import { ExperienceInputSchema } from "./utils";

export type Task = inferProcedureOutput<AppRouter["task"]["getAll"]>[number];
export type OneTask = inferProcedureOutput<AppRouter["task"]["getOne"]>;

export const TaskInputShema = z
  .object({
    name: z
      .string({
        message: "Название не указано",
      })
      .min(1, "Название темы не указано")
      .max(255, "Название темы слишком длинное"),
    deadline: z
      .date({
        invalid_type_error: "Срок не является датой",
      })
      .min(new Date(new Date().getTime() - day))
      .nullable(),
    description: z
      .string({
        message: "Описание не указано",
      })
      .min(1, "Описание не указано"),
    coins: z.coerce
      .number({
        message: "Монеты не указаны",
      })
      .min(1, "Монета не указана"),
    tutorialId: z
      .string({
        required_error: "Туториал не указан",
        invalid_type_error: "Туториал не является строкой",
      })
      .min(1, "Туториал не указан"),
    subjectId: z
      .string({
        required_error: "Предмет не указан",
        invalid_type_error: "Предмет не является строкой",
      })
      .min(1, "Предмет не указан"),
    groupIds: z
      .string({
        required_error: "Группа не указана",
        invalid_type_error: "Группа не является строкой",
      })
      .min(1, "Группа не указана")
      .array(),
  })
  .merge(ExperienceInputSchema);
