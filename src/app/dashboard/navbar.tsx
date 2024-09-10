import { Menu, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import SidebarItem from "~/app/dashboard/item";
import Search from "~/app/dashboard/search";
import { sidebarItems } from "~/app/dashboard/sidebar";
import UserAvatar from "~/components/avatar";
import Logo from "~/components/logo";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "~/components/ui/sheet";
import { getServerAuthSession } from "~/server/auth";

export default async function DashboardNavbar() {
  const session = await getServerAuthSession();

  return (
    <div className="flex h-nav-dashboard-mobile w-screen flex-col items-center justify-center gap-4 bg-secondary px-6 sm:h-nav-dashboard sm:flex-row sm:justify-between">
      <div className="flex w-full flex-row items-center justify-between sm:w-auto">
        <Link href="/">
          <Logo />
        </Link>
        <Sheet>
          <SheetTrigger
            asChild
            className="flex sm:hidden"
          >
            <Button
              variant="ghost"
              size="icon"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="max-h-screen w-screen px-0"
            side="top"
          >
            <SheetHeader className="mb-4 flex flex-row items-center justify-between px-6">
              <Link href="/">
                <Logo />
              </Link>
              <SheetClose>
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <X />
                </Button>
              </SheetClose>
            </SheetHeader>
            <aside className="h-screen-nav-dashboard min-w-[19rem] overflow-y-scroll bg-secondary px-6 py-4">
              {sidebarItems.map((section, index) => (
                <React.Fragment key={index}>
                  {((session?.user.roles.includes("ADMIN") ?? false) ||
                    (session?.user.roles.some((role) =>
                      section.roles.includes(role),
                    ) ??
                      false)) && (
                    <div className="mb-4 space-y-2 px-2">
                      <p className="text-foreground/60">{section.title}</p>
                      <div className="flex flex-col gap-2">
                        {section.items.map((item, index) => (
                          <SidebarItem
                            {...item}
                            key={section.title + index}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </aside>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex w-full flex-row items-center justify-end gap-4 sm:w-auto sm:grow lg:grow-0">
        <Search />
        <span className="hidden sm:block">
          <UserAvatar
            image={session?.user.image?.id ?? undefined}
            name={session?.user.name ?? "Неизвестно"}
          />
        </span>
      </div>
    </div>
  );
}
