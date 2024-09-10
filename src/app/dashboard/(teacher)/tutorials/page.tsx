import Link from "next/link";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import {
  DashboardContent,
  DashboardHeader,
  DashboardTitle,
} from "~/components/ui/dashboard";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "./columns";
import CreateUpdateTutorial from "./create_update";

export default async function Tutorials() {
  const tutorials = await api.tutorial.getAll();

  return (
    <DashboardContent>
      <DashboardHeader>
        <DashboardTitle>Туториалы</DashboardTitle>
        <CreateUpdateTutorial />
      </DashboardHeader>
      <DataTable
        columns={columns}
        data={tutorials}
      />
    </DashboardContent>
  );
}
