import type { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import type { AppRouter } from "~/server/api/root";

export type TeamRole = inferProcedureOutput<
  AppRouter["teamRoles"]["getAll"]
>[number];

export const RoleSchema = z.object({
  name: z
    .string({
      required_error: "Название роли не указано",
      invalid_type_error: "Название не является строкой",
    })
    .min(1, "Роль не может быть пустой")
    .max(255, "Роль слишком длинная"),
});
