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
      required_error: "Не указан ID здания",
      invalid_type_error: "ID здания не является строкой"
    })
    .min(1, "ID здания не заполнен")
    .max(255, "ID здания слишком длинный")
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

export const RoleInputSchema = z.object({
  name: z
    .string({
      required_error: "Имя роли не указано",
      invalid_type_error: "Только буквы"
    })
    .min(1, "Роль не может быть пустой")
    .max(255, "Роль слишком длинная")
});

// user
export type User = inferProcedureOutput<AppRouter["user"]["getAll"]>[number];
