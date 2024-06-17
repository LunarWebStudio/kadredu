"use client";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

export default function SidebarItem({
  title,
  icon,
  href,
  color,
  locked
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
  const active = pathname.startsWith(href);

  return (
    <Link href={href} className="w-full">
      <div
        className={cn(
          "p-2 rounded-lg bg-secondary w-full flex flex-row gap-4 items-center transition-all duration-300 ease-in-out group",
          !locked && cn(color.text_hover, `hover:shadow-xl hover:font-bold hover:scale-[1.02] z-10`),
          active && cn(
            "shadow-lg font-bold scale-[1.02]",
            color.text,
          ),
          locked && "cursor-not-allowed opacity-80"
        )}
      >
        <div className={cn(
          "size-10 rounded-lg flex items-center justify-center text-white",
          color.bg
        )}>
          {icon}
        </div>
        <p
          className={cn(
            active && color.text
          )}
        >{title}</p>
        {locked && (
          <div className="ml-auto group-hover:animate-pulse group-hover:scale-105 transition-all ease-in-out duration-300">
            <LockKeyhole className="size-6" />
          </div>
        )}
      </div>
    </Link>
  )
}
