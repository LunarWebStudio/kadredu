import type { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import {
  DESCRIPTION_LIMIT,
  MAX_PROFILE_PICTURE_SIZE,
  NAME_LIMIT
} from "~/lib/shared/const";
import { day } from "~/lib/shared/time";
import type { AppRouter } from "~/server/api/root";
import { statusSchema } from "~/server/db/schema";

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
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Ник должен содержать только буквы, цифры и подчеркивания"
    )
});

export const CoinsInputSchema = z.object({
  coins: z.coerce
    .number({
      required_error: "Количество монет не заполнено",
      invalid_type_error: "Количество монет не является числом"
    })
    .positive("Количество монет должно быть больше 0")
});

export const ExperienceInputSchema = z.object({
  experience: z.coerce
    .number({
      required_error: "Количество опыта не заполнено",
      invalid_type_error: "Количество опыта не является числом"
    })
    .positive("Количество опыта должно быть больше 0")
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

export type TeamRole = inferProcedureOutput<
  AppRouter["teamRoles"]["getAll"]
>[number];

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

export type Tutorial = inferProcedureOutput<
  AppRouter["tutorial"]["getAll"]
>[number];

export const TutorialInputShema = z.object({
  name: z
    .string({
      required_error: "Название не указано",
      invalid_type_error: "Название не является строкой"
    })
    .min(1, "Название темы не указано")
    .max(255, "Название темы слишком длинное"),
  imageId: z.string({
    required_error: "Фото не задано",
    invalid_type_error: "Фото не является строкой"
  }),
  text: z
    .string({
      required_error: "Текст не указан",
      invalid_type_error: "Текст не является строкой"
    })
    .min(1, "Текст не указан"),
  authorId: z.string({
    required_error: "Автор не указан",
    invalid_type_error: "Текст не является строкой"
  }),
  price: z.coerce.number({
    invalid_type_error: "Цена не является числом"
  }),
  topicId: z
    .string({
      required_error: "Тема не указана",
      invalid_type_error: "Тема не является строкой"
    })
    .min(1, "Тема не указана")
    .max(255, "Тема слишком длинная"),
  timeRead: z.coerce
    .number({
      required_error: "Время не указано",
      invalid_type_error: "Время не является числом"
    })
    .min(1, "Время не указано"),
  subjectId: z
    .string({
      invalid_type_error: "Предмет не является строкой"
    })
})

// tasks
export type Task = inferProcedureOutput<AppRouter["task"]["getAll"]>[number];

export const TaskInputShema = z.intersection(
  z.object({
    name: z
      .string({
        required_error: "Название не указано",
        invalid_type_error: "Название не является строкой"
      })
      .min(1, "Название темы не указано")
      .max(255, "Название темы слишком длинное"),
    deadline: z
      .date({
        invalid_type_error: "Срок не является датой"
      })
      .min(new Date(new Date().getTime() - day))
      .nullable(),
    description: z
      .string({
        required_error: "Описание не указано",
        invalid_type_error: "Описание не является строкой"
      })
      .min(1, "Описание не указано"),
    coin: z.coerce
      .number({
        required_error: "Монета не указана",
        invalid_type_error: "Монета не является строкой"
      })
      .min(1, "Монета не указана"),
    tutorialId: z
      .string({
        required_error: "Туториал не указан",
        invalid_type_error: "Туториал не является строкой"
      })
      .min(1, "Туториал не указан"),
    subjectId: z
      .string({
        required_error: "Предмет не указан",
        invalid_type_error: "Предмет не является строкой"
      })
      .min(1, "Предмет не указан"),
    groupId: z
      .string({
        required_error: "Группа не указана",
        invalid_type_error: "Группа не является строкой"
      })
      .min(1, "Группа не указана")
  }),
  ExperienceInputSchema
);

// resume
export const ResumeInputSchema = z.object({
  roleId: z.string()
    .min(1, "Выберите роль"),
  status: statusSchema,
  experience: z.string().optional()
})

export type Resume = inferProcedureOutput<AppRouter["resume"]["getSelf"]>;

// user
export type User = inferProcedureOutput<AppRouter["user"]["getAll"]>[number];

export const UserUpdateInputSchema = z.intersection(
  z.object({
    name: z
      .string({
        required_error: "ФИО не заполнено",
        invalid_type_error: "ФИО не является строкой"
      })
      .min(1, "ФИО не заполнено")
      .max(NAME_LIMIT)
      .optional(),
    description: z
      .string({
        required_error: "Описание не заполнено",
        invalid_type_error: "Описание не является строкой"
      })
      .max(DESCRIPTION_LIMIT)
      .optional(),
    profilePictureImage: z
      .string({
        required_error: "Фото не выбрано",
        invalid_type_error: "Фото не является строкой"
      })
      .max(MAX_PROFILE_PICTURE_SIZE, "Фото слишком большое")
      .optional()
  }),
  UsernameInputSchema
);

// subject
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

