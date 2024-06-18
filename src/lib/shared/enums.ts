import {type Status, type Role } from "~/server/db/schema";

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
        emoji: "🛠️",
        className: "text-red-800 bg-red-100 border-red-200 border"
      }
    case "LEAD_CYCLE_COMISSION":
      return {
        name: "Глава ПЦК",
        emoji: "🧑‍💼",
        className: "text-blue-800 bg-blue-100 border-blue-200 border"
      }
    case "TEACHER":
      return {
        name: "Преподаватель",
        emoji: "🧑‍🏫",
        className: "text-purple-800 bg-purple-100 border-purple-200 border"
      }
    case "EMPLOYER":
      return {
        name: "Работодатель",
        emoji: "👨‍💻",
        className: "text-green-800 bg-green-100 border-green-200 border"
      }
    case "STUDENT":
      return {
        name: "Ученик",
        emoji: "👨‍🎓",
        className: "text-yellow-800 bg-yellow-100 border-yellow-200 border"
      }
    default:
      return {
        name: "Неизвестный",
        emoji: "🔒",
        className: "text-gray-800 bg-gray-100 border-gray-200 border"
      }
  }
}

export type StatusData = {
  code:Status,
  name:string
}
export const Statuses:StatusData[] =[
  {
    code:"WORK",
    name:"Работаю"
  },
  {
    code:"SEARCH",
    name:"В поиске",
  },
  {
    code:"OPEN_TO_OFFERS",
    name:"Открыт к предложениям"
  }
]
export const GetStatusResume = (status?:Status):StatusData | undefined =>{
  return Statuses.find(el => el.code === status)
}
