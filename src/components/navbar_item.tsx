"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

export default function NavbarItem({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link href={href} className={
      cn(
        "relative hover:text-primary group",
        pathname.startsWith(href) ? "text-primary" : "text-muted-foreground"
      )
    }>
      {children}
      <div className="absolute w-full inset-x-0 h-px bg-primary group-hover:opacity-100 opacity-0 max-w-0 group-hover:max-w-full transition-all ease-in-out duration-300"></div>
    </Link>
  )
}
