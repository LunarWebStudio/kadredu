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
        {children}
      </div>
    </div>
  );
}
