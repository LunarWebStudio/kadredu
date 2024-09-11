import {
  DashboardContent,
  DashboardHeader,
  DashboardTitle,
} from "~/components/ui/dashboard";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/server";
import { columns } from "./columns";

export default async function SubjectsPage() {
  const subjects = await api.subject.getOwned();

  return (
    <DashboardContent>
      <DashboardHeader>
        <DashboardTitle>Задания</DashboardTitle>
      </DashboardHeader>
      <DataTable
        columns={columns}
        data={subjects}
      />
    </DashboardContent>
  );
}
