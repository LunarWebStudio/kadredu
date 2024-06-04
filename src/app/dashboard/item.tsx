"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

export function MobileSidebarItem({
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href}>
            <Button variant="ghost" className={cn(
              "gap-2 w-full justify-start",
              pathName.startsWith(href) ? "bg-muted" : ""
            )}>
              {icon}
              <span className="hidden xl:block">{title}</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="xl:hidden" side="right">
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}


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
