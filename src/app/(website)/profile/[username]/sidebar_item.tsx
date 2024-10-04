"use client";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export default function SidebarItem({
  title,
  icon,
  href,
  color,
  locked,
}: {
  title: string;
  icon: ReactNode;
  href: string;
  color: {
    bg: string;
    text: string;
    text_hover: string;
  };
  locked?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className="w-full"
    >
      <div
        className={cn(
          "group flex w-full flex-row items-center gap-4 rounded-lg bg-secondary p-2 transition-all duration-300 ease-in-out",
          !locked &&
            cn(
              color.text_hover,
              `z-10 hover:scale-[1.02] hover:font-bold hover:shadow-xl`,
            ),
          active && cn("scale-[1.02] font-bold shadow-lg", color.text),
          locked && "cursor-not-allowed opacity-80",
        )}
      >
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg text-white",
            color.bg,
          )}
        >
          {icon}
        </div>
        <p className={cn(active && color.text)}>{title}</p>
        {locked && (
          <div className="ml-auto transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:animate-pulse">
            <LockKeyhole className="size-6" />
          </div>
        )}
      </div>
    </Link>
  );
}
