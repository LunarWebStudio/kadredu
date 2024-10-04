import type { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import { DESCRIPTION_LIMIT, NAME_LIMIT } from "~/lib/shared/const";
import type { AppRouter } from "~/server/api/root";
import { EditFileSchema } from "./file";

export type User = inferProcedureOutput<AppRouter["user"]["getAll"]>[number];

export const UsernameSchema = z.object({
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

export const UserUpdateSchema = z.intersection(
  z.object({
    name: z
      .string({
        message: "ФИО не заполнено",
      })
      .min(1, "ФИО не заполнено")
      .max(NAME_LIMIT)
      .optional(),
    description: z
      .string({
        message: "Описание не заполнено",
      })
      .max(DESCRIPTION_LIMIT)
      .optional(),
    image: EditFileSchema.nullish(),
  }),
  UsernameSchema,
);
