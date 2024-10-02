import { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import type { AppRouter } from "~/server/api/root";
import { EditFileSchema } from "./file";

export type Tutorial = inferProcedureOutput<
  AppRouter["tutorial"]["getAll"]
>[number];

export type OneTutorial = NonNullable<
  inferProcedureOutput<AppRouter["tutorial"]["getOne"]>
>;

export const TutorialInputShema = z.object({
  name: z
    .string({
      message: "Название не указано",
    })
    .min(1, "Название темы не указано")
    .max(255, "Название темы слишком длинное"),
  image: EditFileSchema,
  content: z
    .string({
      message: "Текст не указан",
    })
    .min(1, "Текст не указан"),
  topicId: z
    .string({
      message: "Тема не указана",
    })
    .min(1, "Тема не указана")
    .max(255, "Тема слишком длинная"),
  timeRead: z.coerce
    .number({
      message: "Время не указано",
    })
    .min(1, "Время не указано"),
  youtubeUrl: z.string().url({
    message: "Неверный URL",
  }).regex(
    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    "Неверный формат ссылки на видео"
  ).optional(),
  subjectId: z.string({
    message: "Предмет не является строкой",
  }),
});
