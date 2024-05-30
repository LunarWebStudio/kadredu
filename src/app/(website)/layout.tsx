import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { getServerAuthSession } from "~/server/auth";

export default async function WebsiteLayout({
  children
}: {
  children: ReactNode
}) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/auth");
  }

  if (!session.user.verified) {
    redirect("/verification");
  }

  if (!session.user.onboarding) {
    redirect("/onboarding");
  }

  return <main className="bg-background dark:bg-background">{children}</main>;
}
