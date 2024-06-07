import Logo from "~/components/logo";
import Search from "~/app/dashboard/search";
import UserAvatar from "~/components/avatar";
import { getServerAuthSession } from "~/server/auth";
import { sidebarItems } from "~/app/dashboard/sidebar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Menu, X } from "lucide-react";
import React from "react";
import SidebarItem from "~/app/dashboard/item";

export default async function DashboardNavbar() {
  const session = await getServerAuthSession();

  return (
    <div className="flex h-nav-dashboard-mobile w-screen flex-col items-center justify-center gap-4 bg-secondary px-6 sm:h-nav-dashboard sm:flex-row sm:justify-between">
      <div className="flex w-full flex-row items-center justify-between sm:w-auto">
        <Logo />
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
          <SheetContent className="max-h-screen w-screen px-0">
            <SheetHeader className="mb-4 flex flex-row items-center justify-between px-6">
              <Logo />
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
                  {((session?.user.role.includes("ADMIN") ?? false) ||
                    (session?.user.role.some(role =>
                      section.roles.includes(role)
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
            image={session?.user.profilePicture ?? undefined}
            name={session?.user.name ?? "Неизвестно"}
          />
        </span>
      </div>
    </div>
  );
}
