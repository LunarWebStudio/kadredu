import { DashboardContent, DashboardHeader, DashboardTitle } from "~/components/ui/dashboard";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/server";
import { columns } from "./columns";
import CreateUpdateAchievement from "./create_update";


export default async function Achievements(){
  const achievements = await api.achievements.getAll();

  return (
    <DashboardContent>
      <DashboardHeader>
        <DashboardTitle>Достижения</DashboardTitle>
        <CreateUpdateAchievement />
      </DashboardHeader>
      <DataTable
        columns={columns}
        data={achievements}
      />
    </DashboardContent>
  );
}
