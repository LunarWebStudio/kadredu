import {
  DashboardContent,
  DashboardHeader,
  DashboardTitle,
} from "~/components/ui/dashboard";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/server";
import { columns } from "./columns";

export default async function Users() {
  const users = await api.user.getAll();

  return (
    <DashboardContent>
      <DashboardHeader>
        <DashboardTitle>Пользователи</DashboardTitle>
      </DashboardHeader>
      <DataTable
        columns={columns}
        data={users}
      />
    </DashboardContent>
  );
}
