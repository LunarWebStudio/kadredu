import {
  DashboardContent,
  DashboardHeader,
  DashboardTitle,
} from "~/components/ui/dashboard";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/server";
import { columns } from "./columns";

export default async function SubjectsPage() {
  const subjects = await api.subject.getAssigned();

  return (
    <DashboardContent>
      <DashboardHeader>
        <DashboardTitle>Мои предметы</DashboardTitle>
      </DashboardHeader>
      <DataTable
        columns={columns}
        data={subjects}
      />
    </DashboardContent>
  );
}
