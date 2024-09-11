import { z } from "zod";
import { resumeStatusEnum } from "~/server/db/schema";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

export const ResumeStatusSchema = z.enum(resumeStatusEnum.enumValues);
export type ResumeStatus = z.infer<typeof ResumeStatusSchema>;

export const ResumeSchema = z.object({
  roleId: z
    .string({
      message: "Выберите роль",
    })
    .min(1, "Выберите роль"),
  status: ResumeStatusSchema,
  experience: z
    .string({
      message: "Введите опыт работы",
    })
    .optional()
    .default(""),
});

export type Resume = inferProcedureOutput<AppRouter["resume"]["getSelf"]>;

export const resumeStatusData: Record<ResumeStatus, string> = {
  SEARCH: "В поиске",
  WORK: "Работаю",
  OPEN_TO_OFFERS: "Открыт к предложениям",
};
