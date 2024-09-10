import CreateUpdateRole from "~/app/dashboard/(admin)/roles/create_update";
import {
  DashboardContent,
  DashboardHeader,
  DashboardTitle,
} from "~/components/ui/dashboard";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/server";
import { columns } from "./columns";

export default async function Roles() {
  const roles = await api.teamRoles.getAll();

  return (
    <DashboardContent>
      <DashboardHeader>
        <DashboardTitle>Роли</DashboardTitle>
        <CreateUpdateRole />
      </DashboardHeader>
      <DataTable
        columns={columns}
        data={roles}
      />
    </DashboardContent>
  );
}
