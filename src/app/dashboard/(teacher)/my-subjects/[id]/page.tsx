import {
  DashboardContent,
  DashboardHeader,
  DashboardTitle,
} from "~/components/ui/dashboard";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/server";
import { columns } from "./columns";
import { notFound } from "next/navigation";

export default async function SubjectsPage({
  params,
}: {
  params: { id: string };
}) {
  const subject = await api.subject.getGroups({
    id: params.id,
  });

  if (!subject) {
    notFound();
  }

  return (
    <DashboardContent>
      <DashboardHeader>
        <DashboardTitle>Мои предметы/{subject.name}</DashboardTitle>
      </DashboardHeader>
      <DataTable
        columns={columns}
        data={subject.building.groups}
      />
    </DashboardContent>
  );
}
