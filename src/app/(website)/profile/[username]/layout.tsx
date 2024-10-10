import {
  BookHeart,
  BriefcaseBusiness,
  GraduationCap,
  Settings,
  SquareUserRound,
} from "lucide-react";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import UserAvatar from "~/components/avatar";
import LevelBar from "~/components/level_bar";
import Image from "~/components/ui/image";
import GetLevel from "~/lib/shared/level";
import { HIGH_LEVEL_THRESHOLD } from "~/server/api/trpc";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import SidebarItem from "./sidebar_item";
import Coin from "~/components/icons/coin";
import { ProfileUser } from "~/lib/shared/types/user";
import { cn } from "~/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel";

const iconClassName = "size-6";

function SidebarContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6 rounded-2xl bg-secondary p-6", className)}>
      {children}
    </div>
  );
}

function SidebarSectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-muted-foreground/70", className)}>{children}</p>
  );
}

export default async function ProfileLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: {
    username: string;
  };
}) {
  const session = (await getServerAuthSession())!;
  const user = await api.user.getOne({
    username: params.username,
  });

  if (!user) notFound();

  return (
    <div className="container flex flex-row gap-4 p-4">
      <aside className="flex w-[350px] flex-col gap-4 px-6 py-4 shrink-0">
        <SidebarContainer>
          <div className="flex flex-col items-center justify-center gap-4">
            <UserAvatar
              image={user.imageId ?? ""}
              name={user.name ?? ""}
              className="size-16"
            />
            <h4>{user.username}</h4>
            <p className="text-center text-muted-foreground">{user.name}</p>
            <LevelBar experience={user.experiencePoints} />
            <div className="flex items-center gap-2 justify-center">
              <Coin />
              <p className="font-bold text-lg">{user.coins}</p>
            </div>
          </div>
          <SidebarSectionTitle>Меню</SidebarSectionTitle>
          <div className="flex flex-col gap-4">
            <SidebarItem
              title="Профиль"
              color={{
                bg: "bg-violet-500",
                text: "text-violet-500",
                text_hover: "hover:text-violet-500",
              }}
              href={`/profile/${user.username}`}
              icon={<SquareUserRound className={iconClassName} />}
            />
            <SidebarItem
              title="Портфолио"
              color={{
                bg: "bg-red-400",
                text: "text-red-400",
                text_hover: "hover:text-red-400",
              }}
              href={`/profile/${user.username}/portfolio`}
              icon={<BriefcaseBusiness className={iconClassName} />}
            />
            {session.user.username === user.username && (
              <>
                <SidebarItem
                  title="Задания"
                  color={{
                    bg: "bg-amber-400",
                    text: "text-amber-400",
                    text_hover: "hover:text-amber-400",
                  }}
                  href={`/profile/${session.user.username}/tasks`}
                  icon={<BookHeart className={iconClassName} />}
                />
              </>
            )}

            <SidebarItem
              title="Туториалы"
              color={{
                bg: "bg-green-400",
                text: "text-green-400",
                text_hover: "hover:text-green-400",
              }}
              href={`/profile/${user.username}/tutorials`}
              icon={<GraduationCap className={iconClassName} />}
              locked={
                GetLevel(user.experiencePoints ?? 0).level <
                HIGH_LEVEL_THRESHOLD
              }
            />
            {session.user.username === user.username && (
              <>
                <SidebarItem
                  title="Настройки"
                  color={{
                    bg: "bg-slate-400",
                    text: "text-slate-400",
                    text_hover: "hover:text-slate-400",
                  }}
                  href={`/profile/${user.username}/settings`}
                  icon={<Settings className={iconClassName} />}
                />
              </>
            )}
          </div>
        </SidebarContainer>
        <Group user={user} />
        <Awards user={user} />
      </aside>
      <div className="shrink grow">{children}</div>
    </div>
  );
}

function Group({
  user,
}: {
  user: ProfileUser;
}) {
  return (
    <SidebarContainer>
      <SidebarSectionTitle>Группа</SidebarSectionTitle>
      <div className="flex flex-row items-center gap-4">
        {user.group ? (
          <>
            <div className="size-16">
              <Image
                className="size-full object-contain"
                width={1000}
                height={1000}
                src={user.group?.imageId ?? ""}
                alt={user.group?.name ?? ""}
              />
            </div>
            <p className="font-bold tracking-tighter">
              {user.group?.building.name} / {user.group?.name}
            </p>
          </>
        ) : (
          <p className="font-semibold text-xl">Не в группе</p>
        )}
      </div>
    </SidebarContainer>
  );
}

async function Awards({user}:
  {
    user:ProfileUser
  }){
  const awards = await api.achievements.getById({id:user.id})

  return (
    <SidebarContainer>
      <SidebarSectionTitle>Достижения</SidebarSectionTitle>
      <Carousel
        opts={{
          align:"end"
        }}
      >
        <CarouselContent>
        {
          awards.map((el) =>{
            return (
              <CarouselItem className="md:basis-1/3 basis-1/2 flex items-center justify-center" key={el.id}>
                <Image
                  src={el.achievement.imageId}
                  width={64}
                  height={64}
                  alt={el.achievement.name}
                />
              </CarouselItem>
            )
          })
        }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </SidebarContainer>
  )
}
