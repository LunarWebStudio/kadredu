import Logo from "~/components/logo";
import Search from "~/app/dashboard/search";
import UserAvatar from "~/components/avatar";
import { getServerAuthSession } from "~/server/auth";
import { sidebarItems } from "~/app/dashboard/sidebar";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Menu, X } from "lucide-react";
import React from "react";
import SidebarItem from "~/app/dashboard/item";

export default async function DashboardNavbar() {
  const session = await getServerAuthSession();

  return (
    <div className="flex flex-col sm:flex-row h-nav-dashboard-mobile sm:h-nav-dashboard w-screen items-center justify-center sm:justify-between bg-secondary px-6 gap-4">
      <div className="flex flex-row w-full sm:w-auto justify-between items-center">
        <Logo />
        <Sheet>
          <SheetTrigger asChild className="flex sm:hidden">
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-screen px-0 max-h-screen">
            <SheetHeader className="mb-4 px-6 flex flex-row justify-between items-center">
              <Logo />
              <SheetClose>
                <Button variant="ghost" size="icon">
                  <X />
                </Button>
              </SheetClose>
            </SheetHeader>
            <aside className="px-6 py-4 bg-secondary h-screen-nav-dashboard min-w-[19rem]">
              {sidebarItems.map((section, index) => (
                <React.Fragment key={index}>
                  {((session?.user.role.includes("ADMIN") ?? false) || (session?.user.role.some((role) => section.roles.includes(role)) ?? false)) && (
                    <div className="mb-4 space-y-2 px-2">
                      <p className="text-foreground/60">{section.title}</p>
                      <div className="flex flex-col gap-2">
                        {section.items.map((item, index) => (
                          <SidebarItem {...item} key={section.title + index} />
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
      <div className="flex flex-row gap-4 w-full sm:w-auto sm:grow lg:grow-0 justify-end items-center">
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
