import { z } from "zod";
import { EditFileSchema } from "./file";
import { eventTypeSchema } from "~/server/db/schema";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { EventType } from "~/server/db/schema"
import { IdInputSchema } from "../types";



export type event = Record<EventType, string>

export const eventTypes:event = {
  "REGISTRATION":"Регистрация",
  "CREATE_TUTORIAL":"Создание урока",
  "CREATE_PROJECT":"Создание проекта",
  "CREATE_RESUME":"Создание резюме",
  "PUT_LIKE":"Поставить лайк",
  "GET_LIKE":"Получить лайк",
  "COMPLETED_TASK":"Завершить задание",
  "RECEIVED_COINS":"Получить монеты",
  "RECEIVED_COINS_AMOUNT":"Получить количество монет",
  "CUSTOM":"Уникальное",
}

export const GrantAchievementSchema = z.intersection(
  IdInputSchema,
  z.object({
    achievementId: z.string(),
  })
)

export const AchievementSchema = z.object({
  name: z.string({
    required_error: "Название не заполнено",
    invalid_type_error: "Название не является строкой",
  })
  .min(1, "Название не заполнено")
  .max(255, "Название слишком длинное"),

  image: EditFileSchema,

  coins: z.coerce.number({
    required_error: "Количество монет не заполнено",
    invalid_type_error: "Количество монет не является числом",
  })
  .min(0, "Количество не может быть отрицательным"),

  experience: z.coerce.number({
    required_error: "Количество опыта не заполнено",
    invalid_type_error: "Количество опыта не является числом",
  })
  .min(0, "Количество не может быть отрицательным"),

  eventType: eventTypeSchema,
  eventAmount: z.coerce.number({
    required_error: "Количество событий не заполнено",
    invalid_type_error: "Количество событий не является числом",
  })
  .min(1, "Количество событий не заполнено"),

  description: z.string({
    required_error: "Описание не заполнено",
    invalid_type_error: "Описание не является строкой",
  })
  .min(1, "Описание не заполнено")
  .max(255, "Описание слишком длинное"),
}) 

export type Achievement = inferProcedureOutput<AppRouter["achievements"]["getAll"]>[number];
