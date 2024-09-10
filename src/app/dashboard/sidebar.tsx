import {
  Award,
  BookA,
  BookUser,
  Building,
  Calendar,
  ClipboardList,
  Crown,
  Glasses,
  Group,
  User,
} from "lucide-react";
import React from "react";
import { MobileSidebarItem } from "~/app/dashboard/item";
import { Separator } from "~/components/ui/separator";
import { getServerAuthSession } from "~/server/auth";
import type { Role } from "~/server/db/schema";

const iconClassName = "size-4";

type SidebarItem = {
  title: string;
  roles: Role[];
  items: {
    icon: React.ReactNode;
    href: string;
    title: string;
  }[];
};

export const sidebarItems: SidebarItem[] = [
  {
    title: "Администратор",
    roles: ["ADMIN"],
    items: [
      {
        icon: <Building className={iconClassName} />,
        href: "/dashboard/buildings",
        title: "СП",
      },
      {
        icon: <Group className={iconClassName} />,
        href: "/dashboard/groups",
        title: "Группы",
      },
      {
        icon: <Crown className={iconClassName} />,
        href: "/dashboard/roles",
        title: "Роли в команду",
      },
      {
        icon: <BookA className={iconClassName} />,
        href: "/dashboard/topics",
        title: "Темы для статей",
      },
    ],
  },
  {
    title: "Глава ПЦК",
    roles: ["LEAD_CYCLE_COMISSION"],
    items: [
      {
        icon: <Award className={iconClassName} />,
        href: "/dashboard/awards",
        title: "Награды",
      },
      {
        icon: <Calendar className={iconClassName} />,
        href: "/dashboard/events",
        title: "События",
      },
      {
        icon: <BookUser className={iconClassName} />,
        href: "/dashboard/subjects",
        title: "Предметы",
      },
    ],
  },
  {
    title: "Преподаватель",
    roles: ["TEACHER"],
    items: [
      {
        icon: <User className={iconClassName} />,
        href: "/dashboard/users",
        title: "Пользователи",
      },
      {
        icon: <Glasses className={iconClassName} />,
        href: "/dashboard/tutorials",
        title: "Туториалы",
      },
      {
        icon: <ClipboardList className={iconClassName} />,
        href: "/dashboard/tasks",
        title: "Задания",
      },
      {
        icon: <BookUser className={iconClassName} />,
        href: "/dashboard/my-subjects",
        title: "Мои предметы",
      },
    ],
  },
];

export default async function Sidebar() {
  const session = await getServerAuthSession();

  return (
    <aside className="px-1 xl:px-6 py-4 bg-secondary h-screen-nav-dashboard hidden sm:block xl:min-w-[19rem]">
      {sidebarItems.map((section, index) => (
        <React.Fragment key={index}>
          {((session?.user.roles.includes("ADMIN") ?? false) ||
            (session?.user.roles.some((role) => section.roles.includes(role)) ??
              false)) && (
            <>
              <div className="mb-4 space-y-2 px-2">
                <p className="text-foreground/60 hidden xl:block">
                  {section.title}
                </p>
                <div className="flex flex-col gap-2">
                  {section.items.map((item, index) => (
                    <MobileSidebarItem
                      {...item}
                      key={section.title + index}
                    />
                  ))}
                </div>
              </div>
              <Separator className="block xl:hidden last:hidden w-2/3 mx-auto" />
            </>
          )}
        </React.Fragment>
      ))}
    </aside>
  );
}
