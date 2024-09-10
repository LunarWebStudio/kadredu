import type { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import {
  DESCRIPTION_LIMIT,
  MAX_PROFILE_PICTURE_SIZE,
  NAME_LIMIT,
} from "~/lib/shared/const";
import type { AppRouter } from "~/server/api/root";

export type User = inferProcedureOutput<AppRouter["user"]["getAll"]>[number];

export const UsernameInputSchema = z.object({
  username: z
    .string({
      required_error: "Ник не заполнен",
      invalid_type_error: "Ник не является строкой",
    })
    .min(1, "Ник не заполнен")
    .max(255, "Ник слишком длинный")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Ник должен содержать только буквы, цифры и подчеркивания",
    ),
});

export const CoinsInputSchema = z.object({
  coins: z.coerce
    .number({
      required_error: "Количество монет не заполнено",
      invalid_type_error: "Количество монет не является числом",
    })
    .positive("Количество монет должно быть больше 0"),
});

export const UserUpdateInputSchema = z.intersection(
  z.object({
    name: z
      .string({
        required_error: "ФИО не заполнено",
        invalid_type_error: "ФИО не является строкой",
      })
      .min(1, "ФИО не заполнено")
      .max(NAME_LIMIT)
      .optional(),
    description: z
      .string({
        required_error: "Описание не заполнено",
        invalid_type_error: "Описание не является строкой",
      })
      .max(DESCRIPTION_LIMIT)
      .optional(),
    profilePictureImage: z
      .string({
        required_error: "Фото не выбрано",
        invalid_type_error: "Фото не является строкой",
      })
      .max(MAX_PROFILE_PICTURE_SIZE, "Фото слишком большое")
      .optional(),
  }),
  UsernameInputSchema,
);
