import type { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import { day } from "~/lib/shared/time";
import type { AppRouter } from "~/server/api/root";
import { statusSchema } from "~/server/db/schema";
import { ExperienceInputSchema } from "./types/utils";

export const IdInputSchema = z.object({
  id: z
    .string({
      required_error: "ID не указан",
      invalid_type_error: "ID не является строкой",
    })
    .min(1, "ID не заполнен")
    .max(255, "ID слишком длинный"),
});

export type Tutorial = inferProcedureOutput<
  AppRouter["tutorial"]["getAll"]
>[number];

export type OneTutorial = NonNullable<
  inferProcedureOutput<AppRouter["tutorial"]["getOne"]>
>;

export const TutorialInputShema = z.object({
  name: z
    .string({
      required_error: "Название не указано",
      invalid_type_error: "Название не является строкой",
    })
    .min(1, "Название темы не указано")
    .max(255, "Название темы слишком длинное"),
  imageId: z.string({
    required_error: "Фото не задано",
    invalid_type_error: "Фото не является строкой",
  }),
  text: z
    .string({
      required_error: "Текст не указан",
      invalid_type_error: "Текст не является строкой",
    })
    .min(1, "Текст не указан"),
  authorId: z.string({
    required_error: "Автор не указан",
    invalid_type_error: "Текст не является строкой",
  }),
  price: z.coerce.number({
    invalid_type_error: "Цена не является числом",
  }),
  topicId: z
    .string({
      required_error: "Тема не указана",
      invalid_type_error: "Тема не является строкой",
    })
    .min(1, "Тема не указана")
    .max(255, "Тема слишком длинная"),
  timeRead: z.coerce
    .number({
      required_error: "Время не указано",
      invalid_type_error: "Время не является числом",
    })
    .min(1, "Время не указано"),
  subjectId: z.string({
    invalid_type_error: "Предмет не является строкой",
  }),
});

// tasks
export type Task = inferProcedureOutput<AppRouter["task"]["getAll"]>[number];

export const TaskInputShema = z.intersection(
  z.object({
    name: z
      .string({
        required_error: "Название не указано",
        invalid_type_error: "Название не является строкой",
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
        required_error: "Описание не указано",
        invalid_type_error: "Описание не является строкой",
      })
      .min(1, "Описание не указано"),
    coin: z.coerce
      .number({
        required_error: "Монета не указана",
        invalid_type_error: "Монета не является строкой",
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
    groupId: z
      .string({
        required_error: "Группа не указана",
        invalid_type_error: "Группа не является строкой",
      })
      .min(1, "Группа не указана"),
  }),
  ExperienceInputSchema,
);

// resume
export const ResumeInputSchema = z.object({
  roleId: z.string().min(1, "Выберите роль"),
  status: statusSchema,
  experience: z.string().optional(),
});

export type Resume = inferProcedureOutput<AppRouter["resume"]["getSelf"]>;

// portfolio
export const PortfolioProjectInputSchema = z.object({
  name: z
    .string({
      required_error: "Название проекта не указано",
      invalid_type_error: "Название не является строкой",
    })
    .min(1, "Название не может быть пустым")
    .max(255, "Название слишком длинное"),
  emoji: z
    .string({
      required_error: "Эмодзи не указан",
    })
    .emoji("Неверный эмодзи")
    .min(1, "Эмодзи не может быть пустым"),
  description: z
    .string({
      required_error: "Описание не указано",
      invalid_type_error: "Описание не является строкой",
    })
    .max(500, "Описание слишком длинное"),
  repoName: z
    .string({
      required_error: "Название репозитория не указано",
      invalid_type_error: "Название не является строкой",
    })
    .min(1, "Название репозитория не может быть пустым"),
});

export type PortfolioProject = inferProcedureOutput<
  AppRouter["portfolio"]["getByUsername"]
>[number];
export type OnePortfolioProject = inferProcedureOutput<
  AppRouter["portfolio"]["getOne"]
>;

export type GithubRepository = inferProcedureOutput<
  AppRouter["github"]["getOwnedRepos"]
>[number];
