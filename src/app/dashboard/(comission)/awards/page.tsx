import { DashboardContent, DashboardHeader, DashboardTitle } from "~/components/ui/dashboard";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/server";
import { columns } from "./columns";
import CreateUpdateAwards from "./create_update";


export default async function Awards(){
  const achievements = await api.achievements.getAll();

  return (
    <DashboardContent>
      <DashboardHeader>
        <DashboardTitle>Награды</DashboardTitle>
        <CreateUpdateAwards />
      </DashboardHeader>
      <DataTable
        columns={columns}
        data={achievements}
      />
    </DashboardContent>
  );
}
