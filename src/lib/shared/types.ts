import { z } from "zod";

export const IdInputSchema = z.object({
  id: z
    .string({
      required_error: "ID не указан",
      invalid_type_error: "ID не является строкой",
    })
    .min(1, "ID не заполнен")
    .max(255, "ID слишком длинный"),
});

export const DateSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional()
}).optional();
