import { type ReactNode } from "react";
import DashboardNavbar from "~/app/dashboard/navbar";
import Sidebar from "~/app/dashboard/sidebar";

export default async function DashboardLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <div className="h-screen w-screen">
      <DashboardNavbar />
      <div className="flex flex-row">
        <Sidebar />
        <div className="flex h-screen-nav-dashboard grow items-center justify-center overflow-hidden p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
