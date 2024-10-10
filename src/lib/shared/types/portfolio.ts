import { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import { AppRouter } from "~/server/api/root";

export const PortfolioProjectSchema = z.object({
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


export type Like = inferProcedureOutput<AppRouter["portfolio"]["getLikesUser"]>[number];
