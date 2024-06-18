import { BookHeart, BriefcaseBusiness, GraduationCap, Settings, SquareUserRound } from "lucide-react";
import { type ReactNode } from "react";
import UserAvatar from "~/components/avatar";
import LevelBar from "~/components/level_bar";
import { getServerAuthSession } from "~/server/auth";
import SidebarItem from "~/app/(website)/profile/sidebar_item";
import GetLevel from "~/lib/shared/level";
import S3Image from "~/components/s3Image";

const iconClassName = "size-6";

export default async function ProfileLayout({
  children
}: {
  children: ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <div className="flex flex-row gap-4 p-4">
      <aside className="w-[350px] flex flex-col gap-4 py-4 px-6">
        <div className="rounded-xl bg-secondary space-y-6 p-6">
          <div className="flex flex-col gap-4 justify-center items-center">
            <UserAvatar image={session?.user.profilePicture ?? undefined} name={session?.user.name ?? ""} className="size-16" />
            <h4>{session?.user.username}</h4>
            <p className="text-center text-muted-foreground">{session?.user.name}</p>
            <LevelBar experience={session?.user.experiencePoints ?? 0} />
          </div>
          <p className="text-muted-foreground/70">Меню</p>
          <div className="flex flex-col gap-4">
            <SidebarItem
              title="Профиль"
              color={{
                bg: "bg-violet-500",
                text: "text-violet-500",
                text_hover: "hover:text-violet-500"
              }}
              href={`/profile/${session?.user.username}`}
              icon={<SquareUserRound className={iconClassName} />}
            />
            <SidebarItem
              title="Портфолио"
              color={{
                bg: "bg-red-400",
                text: "text-red-400",
                text_hover: "hover:text-red-400"
              }}
              href={`/profile/${session?.user.username}/portfolio`}
              icon={<BriefcaseBusiness className={iconClassName} />}
            />
            <SidebarItem
              title="Задания"
              color={{
                bg: "bg-amber-400",
                text: "text-amber-400",
                text_hover: "hover:text-amber-400"
              }}
              href={`/profile/${session?.user.username}/portfolio`}
              icon={<BookHeart className={iconClassName} />}
            />
            <SidebarItem
              title="Туториалы"
              color={{
                bg: "bg-green-400",
                text: "text-green-400",
                text_hover: "hover:text-green-400"
              }}
              href={`/tutorials/${session?.user.username}`}
              icon={<GraduationCap className={iconClassName} />}
              locked={GetLevel(session?.user.experiencePoints ?? 0) < 3}
            />
            <SidebarItem
              title="Настройки"
              color={{
                bg: "bg-slate-400",
                text: "text-slate-400",
                text_hover: "hover:text-slate-400"
              }}
              href="/settings"
              icon={<Settings className={iconClassName} />}
            />
          </div>
        </div>
        <div className="rounded-xl bg-secondary p-6 space-y-6">
          <p className="text-muted-foreground/70">Группа</p>
          <div className="flex flex-row gap-4 items-center">
            <div className="size-16">
              <S3Image
                className="size-full object-contain"
                width={1000}
                height={1000}
                src={session?.user.group?.image?.storageId ?? ""}
                blurDataURL={session?.user.group?.image?.blurPreview}
                placeholder="blur"
                alt={session?.user.group?.title ?? ""}
              />
            </div>
            <p className="font-bold tracking-tighter">{session?.user.group?.building.title} / {session?.user.group?.title}</p>
          </div>
        </div>
      </aside>
      {children}
    </div>
  );
}
