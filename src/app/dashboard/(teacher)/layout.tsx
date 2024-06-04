import { type ReactNode } from "react";
import NotFoundPage from "~/app/not-found";
import { getServerAuthSession } from "~/server/auth";

export default async function TeacherLayout({
  children
}: {
  children: ReactNode
}) {
  const session = await getServerAuthSession();
  if (!session?.user.role.includes("TEACHER") && !session?.user.role.includes("ADMIN")) {
    return <NotFoundPage />;
  }

  return children;
}
