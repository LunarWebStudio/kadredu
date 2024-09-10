import { z } from "zod";

export const IdSchema = z.object({
  id: z
    .string({
      required_error: "ID не указан",
      invalid_type_error: "ID не является строкой",
    })
    .min(1, "ID не заполнен")
    .max(255, "ID слишком длинный"),
});

export const ExperienceInputSchema = z.object({
  experience: z.coerce
    .number({
      required_error: "Количество опыта не заполнено",
      invalid_type_error: "Количество опыта не является числом",
    })
    .positive("Количество опыта должно быть больше 0"),
});
