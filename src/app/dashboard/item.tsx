"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function SidebarItem({
  title,
  href,
  icon
}: {
  title: string
  href: string
  icon: ReactNode
}) {
  const pathName = usePathname();

  return (
    <Link href={href}>
      <Button variant="ghost" className={cn(
        "gap-2 w-full justify-start",
        pathName.startsWith(href) ? "bg-muted" : ""
      )}>
        {icon}
        {title}
      </Button>
    </Link>
  );
}
