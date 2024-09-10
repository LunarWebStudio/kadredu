import {
  DashboardContent,
  DashboardHeader,
  DashboardTitle,
} from "~/components/ui/dashboard";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/server";
import { columns } from "./columns";
import CreateUpdateGroup from "./create_update";

export default async function Groups() {
  const groups = await api.group.getAll();

  return (
    <DashboardContent>
      <DashboardHeader>
        <DashboardTitle>Группы</DashboardTitle>
        <CreateUpdateGroup />
      </DashboardHeader>
      <DataTable
        columns={columns}
        data={groups}
      />
    </DashboardContent>
  );
}
