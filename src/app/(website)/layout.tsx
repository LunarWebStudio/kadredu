import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import Footer from "~/components/footer";
import Navbar from "~/components/navbar";
import { getServerAuthSession } from "~/server/auth";

export default async function WebsiteLayout({
  children,
}: {
  children: ReactNode;
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

  return (
    <main className="bg-background dark:bg-background min-h-screen-nav flex flex-col">
      <Navbar />
      <div className="grow mt-nav min-h-screen-nav">{children}</div>
      <Footer />
    </main>
  );
}
