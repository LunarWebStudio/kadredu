import type { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import type { AppRouter } from "~/server/api/root";

// building
export type Building = inferProcedureOutput<
  AppRouter["building"]["getAll"]
>[number];

export const BuildingInputSchema = z.object({
  title: z
    .string({
      required_error: "Название не заполнено",
      invalid_type_error: "Название не является строкой"
    })
    .min(1, "Название не заполнено")
    .max(255, "Название слишком длинное"),
  address: z
    .string({
      required_error: "Адрес не заполнен",
      invalid_type_error: "Адрес не является строкой"
    })
    .min(1, "Адрес не заполнен")
    .max(255, "Адрес слишком длинный")
});

// group

export type Group = inferProcedureOutput<AppRouter["group"]["getAll"]>[number];

export const GroupInputSchema = z.object({
  title: z
    .string({
      required_error: "Название не заполнено",
      invalid_type_error: "Название не является строкой"
    })
    .min(1, "Название не заполнено")
    .max(255, "Название слишком длинное"),
  image: z.string({
    required_error: "Фото не задано",
    invalid_type_error: "Фото не является строкой"
  }),
  buildingId: z
    .string({
      required_error: "Не указан ID СП",
      invalid_type_error: "ID СП не является строкой"
    })
    .min(1, "ID СП не заполнен")
    .max(255, "ID СП слишком длинный")
});

export const IdInputSchema = z.object({
  id: z
    .string({
      required_error: "ID не указан",
      invalid_type_error: "ID не является строкой"
    })
    .min(1, "ID не заполнен")
    .max(255, "ID слишком длинный")
});

export const UsernameInputSchema = z.object({
  username: z
    .string({
      required_error: "Ник не заполнен",
      invalid_type_error: "Ник не является строкой"
    })
    .min(1, "Ник не заполнен")
    .max(255, "Ник слишком длинный")
    .regex(/^[a-zA-Z_]+$/)
});

export const RoleInputSchema = z.object({
  name: z
    .string({
      required_error: "Название роли не указано",
      invalid_type_error: "Название не является строкой"
    })
    .min(1, "Роль не может быть пустой")
    .max(255, "Роль слишком длинная")
});
export type Topic = inferProcedureOutput<AppRouter["topic"]["getAll"]>[number];

export const TopicsInputShema = z.object({
  name: z
    .string({
      required_error: "Название не указано",
      invalid_type_error: "Название не является строкой"
    })
    .min(1, "Название темы не указано")
    .max(255, "Название темы слишком длинное")
});

export type Tutorial = inferProcedureOutput<AppRouter["tutorial"]["getAll"]>[number];

export const TutorialInputShema = z.object({
  name: z
    .string({
      required_error: "Название не указано",
      invalid_type_error: "Название не является строкой"
    })
    .min(1, "Название темы не указано")
    .max(255, "Название темы слишком длинное"),
  image: z.string({
      required_error: "Фото не задано",
      invalid_type_error: "Фото не является строкой"
    }),
  text: z
    .string({
      required_error: "Текст не указан",
      invalid_type_error: "Текст не является строкой"
    })
    .min(1, "Текст не указан"),
  author: z
    .string({
      required_error: "Автор не указан",
      invalid_type_error: "Текст не является строкой"
    }),
  price: z
    .string({
      invalid_type_error: "Цена не является строкой"
    }),
  topicId: z
    .string({
      required_error: "Тема не указана",
      invalid_type_error: "Тема не является строкой"
    })
    .min(1, "Тема не указана")
    .max(255, "Тема слишком длинная"),
  timeRead: z
    .string({
      required_error: "Время не указано",
      invalid_type_error: "Время не является строкой"
    })
    .min(1, "Время не указана"),
  subjectId: z
    .string({
      invalid_type_error: "Предмет не является строкой"
    })
})


export type Task = inferProcedureOutput<AppRouter["task"]["getAll"]>[number];

export const TaskInputShema = z.object({
  name: z
    .string({
      required_error: "Название не указано",
      invalid_type_error: "Название не является строкой"
    })
    .min(1, "Название темы не указано")
    .max(255, "Название темы слишком длинное"),
  deadline: z
    .string({
      required_error: "Сроки не указаны",
      invalid_type_error: "Срок не является строкой"
    })
    .min(1, "Срок не указан"),
  description: z
    .string({
      required_error: "Описание не указано",
      invalid_type_error: "Описание не является строкой"
    })
    .min(1, "Описание не указано"),
  experience: z
    .string({
      required_error: "Опыт не указан",
      invalid_type_error: "Опыт не является строкой"
    })
    .min(1, "Опыт не указан"),
  coin: z
    .string({
      required_error: "Монета не указана",
      invalid_type_error: "Монета не является строкой"
    })
    .min(1, "Монета не указана"),
  tutorial: z
    .string({
      required_error: "Туториал не указан",
      invalid_type_error: "Туториал не является строкой"
    })
    .min(1, "Туториал не указан"),
  subject: z
    .string({
      invalid_type_error: "Предмет не является строкой"
    })
    .min(1, "Предмет не указан"),
})

// user
export type User = inferProcedureOutput<AppRouter["user"]["getAll"]>[number];

export const SubjectInputSchema = z.object({
  name: z
    .string({
      required_error: "Название предмета не указанно",
      invalid_type_error: "Название не является строкой"
    })
    .min(1, "Название не может быть пустым")
    .max(255, "Название слишком длинное"),
  teacherId: z
    .string({
      required_error: "Преподаватель не указан",
      invalid_type_error: "Ошибка ID преподавателя"
    })
    .min(1, "ID преподавателя не заполнен")
    .max(255, "ID преподавателя слишком длинный")
});

export type Subject = inferProcedureOutput<
  AppRouter["subject"]["getAll"]
>[number];
