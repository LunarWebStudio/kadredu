import CreateUpdateSubject from "~/app/dashboard/(comission)/subjects/create_update";
import {
  DashboardContent,
  DashboardHeader,
  DashboardTitle,
} from "~/components/ui/dashboard";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/server";
import { columns } from "./columns";

export default async function Subjects() {
  const subjects = await api.subject.getAll();

  return (
    <DashboardContent>
      <DashboardHeader>
        <DashboardTitle>Предметы</DashboardTitle>
        <CreateUpdateSubject />
      </DashboardHeader>
      <DataTable
        columns={columns}
        data={subjects}
      />
    </DashboardContent>
  );
}
