import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import DashboardNavbar from "~/app/dashboard/navbar";
import Sidebar from "~/app/dashboard/sidebar";
import { getServerAuthSession } from "~/server/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerAuthSession();

  if (
    (session?.user.roles.every((r) => r === "STUDENT") ?? false) ||
    session?.user.roles.length === 0
  ) {
    redirect("/auth");
  }

  return (
    <div className="h-screen w-screen">
      <DashboardNavbar />
      <div className="flex flex-row">
        <Sidebar />
        <div className="flex h-screen-nav-dashboard-mobile md:h-screen-nav-dashboard grow items-center justify-center overflow-hidden p-4 sm:p-6 xl:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
