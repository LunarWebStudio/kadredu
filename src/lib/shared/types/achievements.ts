import { z } from "zod";
import { EditFileSchema } from "./file";
import { eventTypeSchema, rewardTypeSchema } from "~/server/db/schema";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { EventType } from "~/server/db/schema"



export type event = {
  code:EventType,
  name:string
}

export const eventTypes:event[] = [
  {
    code:"PUT_LIKE",
    name:"Поставить лайк"
  },
  {
    code:"GET_LIKE",
    name:"Получить лайк"
  },
  {
    code:"REGISTRATION",
    name:"Регистрация"
  },
  {
    code:"CREATE_RESUME",
    name:"Создать резюме"
  },
  {
    code:"CREATE_PROJECT",
    name:"Создать проект"
  },
  {
    code:"COMPLITED_TASK",
    name:"Завершить задание",
  },
  {
    code:"RECEIVED_COINS",
    name:"Получить монеты"
  },
  {
    code:"CREATE_TUTORIAL",
    name:"Создать туториал"
  },
  {
    code:"RECEIVED_COINS_AMOUNT",
    name:"Получить определенную сумму монет",
  }
]

export const AchievementSchema = z.object({
  name: z.string({
    required_error: "Название не заполнено",
    invalid_type_error: "Название не является строкой",
  })
  .min(1, "Название не заполнено")
  .max(255, "Название слишком длинное"),

  image: EditFileSchema,

  rewardType: rewardTypeSchema,
  rewardAmount: z.coerce.number({
    required_error: "Награда не заполнена",
    invalid_type_error: "Количество не является числом",
  })
  .min(1, "Награда не заполнена"),

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
