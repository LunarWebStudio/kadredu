import type { Role } from "~/server/db/schema";

export type RoleData = {
  name: string;
  emoji: string;
  className: string;
};

export function GetRoleData(role: Role | undefined): RoleData {
  switch (role) {
    case "ADMIN":
      return {
        name: "Администратор",
        emoji: "🛠",
        className:
          "text-red-800 bg-red-100 border-red-200 border dark:bg-red-500 dark:border-red-400 dark:text-red-100",
      };
    case "LEAD_CYCLE_COMISSION":
      return {
        name: "Глава ПЦК",
        emoji: "🧑",
        className:
          "text-blue-800 bg-blue-100 border-blue-200 border dark:bg-blue-500 dark:border-blue-400 dark:text-blue-100",
      };
    case "TEACHER":
      return {
        name: "Преподаватель",
        emoji: "🧑",
        className:
          "text-purple-800 bg-purple-100 border-purple-200 border dark:bg-purple-500 dark:border-purple-400 dark:text-purple-100",
      };
    case "EMPLOYER":
      return {
        name: "Работодатель",
        emoji: "👨",
        className:
          "text-green-800 bg-green-100 border-green-200 border dark:bg-green-500 dark:border-green-400 dark:text-green-100",
      };
    case "STUDENT":
      return {
        name: "Ученик",
        emoji: "👨",
        className:
          "text-yellow-800 bg-yellow-100 border-yellow-200 border dark:bg-yellow-500 dark:border-yellow-400 dark:text-yellow-100",
      };
    default:
      return {
        name: "Неизвестный",
        emoji: "🔒",
        className:
          "text-gray-800 bg-gray-100 border-gray-200 border dark:bg-gray-500 dark:border-gray-400 dark:text-gray-100",
      };
  }
}
