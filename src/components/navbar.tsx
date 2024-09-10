import UserAvatar from "~/components/avatar";
import Logo from "~/components/logo";
import NavbarItem from "~/components/navbar_item";
import { getServerAuthSession } from "~/server/auth";

export const navbarItems = [
  {
    title: "Главная",
    href: "/",
  },
  {
    title: "Профиль",
    href: "/profile",
  },
  {
    title: "Профиль",
    href: "/profile",
  },
  {
    title: "Профиль",
    href: "/profile",
  },
  {
    title: "Профиль",
    href: "/profile",
  },
  {
    title: "Профиль",
    href: "/profile",
  },
];

export default async function Navbar() {
  const session = await getServerAuthSession();
  return (
    <div className="fixed inset-x-0 top-0 w-screen border-b border-primary bg-background dark:bg-background z-40">
      <div className="container h-nav flex flex-row justify-between items-center relative">
        <Logo />
        <div className="flex gap-10 w-2/5 flex-row items-center justify-end">
          {navbarItems.map((item) => (
            <NavbarItem
              key={item.title}
              href={item.href}
            >
              {item.title}
            </NavbarItem>
          ))}
        </div>
        <div className="size-20 absolute right-1/2 translate-x-1/2 top-1/3 z-50 isolate">
          <UserAvatar
            image={session?.user.profilePicture ?? undefined}
            name={session?.user.name ?? "Неизвестно"}
            className="size-full"
          />
        </div>
      </div>
    </div>
  );
}
