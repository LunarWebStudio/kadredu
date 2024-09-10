import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getServerAuthSession } from "~/server/auth";

export default async function ComissionLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerAuthSession();
  if (
    !session?.user.roles.includes("LEAD_CYCLE_COMISSION") &&
    !session?.user.roles.includes("ADMIN")
  ) {
    return notFound();
  }
  return children;
}
