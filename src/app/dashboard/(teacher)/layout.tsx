import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getServerAuthSession } from "~/server/auth";

export default async function TeacherLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerAuthSession();
  if (
    !session?.user.roles.includes("TEACHER") &&
    !session?.user.roles.includes("ADMIN")
  ) {
    return notFound();
  }

  return children;
}
