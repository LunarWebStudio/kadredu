import { BookA, Building, Crown, Group, Award, Calendar, BookUser, User, Glasses, ClipboardList } from "lucide-react";
import { type Role } from "~/server/db/schema";
import SidebarItem from "~/app/dashboard/item";

const iconClassName = "size-4";

type SidebarItem = {
  title: string;
  roles: Role[];
  items: {
    icon: React.ReactNode
    href: string
    title: string
  }[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Администратор",
    roles: ["ADMIN"] as Role[],
    items: [
      {
        icon: <Building className={iconClassName} />,
        href: "/buildings",
        title: "СП"
      },
      {
        icon: <Group className={iconClassName} />,
        href: "/groups",
        title: "Группы"
      },
      {
        icon: <Crown className={iconClassName} />,
        href: "/roles",
        title: "Роли в команду"
      },
      {
        icon: <BookA className={iconClassName} />,
        href: "/themes",
        title: "Темы для статей"
      }
    ]
  },
  {
    title: "Глава ПЦК",
    roles: ["LEAD_CYCLE_COMISSION"],
    items: [
      {
        icon: <Award className={iconClassName} />,
        href: "/awards",
        title: "Награды"
      },
      {
        icon: <Calendar className={iconClassName} />,
        href: "/events",
        title: "События"
      },
      {
        icon: <BookUser className={iconClassName} />,
        href: "/subjects",
        title: "Предметы"
      }
    ]
  },
  {
    title: "Преподаватель",
    roles: ["TEACHER"],
    items: [
      {
        icon: <User className={iconClassName} />,
        href: "/users",
        title: "Пользователи"
      },
      {
        icon: <Glasses className={iconClassName} />,
        href: "/tutorials",
        title: "Туториалы"
      },
      {
        icon: <ClipboardList className={iconClassName} />,
        href: "/tasks",
        title: "Задания"
      }
    ]
  }
];

export default function Sidebar() {
  return (
    <aside className="px-6 py-4 bg-secondary h-screen min-w-[19rem]">
      {sidebarItems.map((section, index) => (
        <div key={index} className="mb-4 space-y-2 px-2">
          <p className="text-foreground/60">{section.title}</p>
          <div className="flex flex-col gap-2">
            {section.items.map((item, index) => (
              <SidebarItem {...item} key={section.title + index} />
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}

