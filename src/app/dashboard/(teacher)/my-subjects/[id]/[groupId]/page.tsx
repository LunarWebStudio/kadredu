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
  params: { id: string; groupId: string };
}) {
  const subject = await api.subject.getStudents({
    id: params.id,
    groupId: params.groupId,
  });

  const group = subject?.building.groups[0];

  if (!subject || !group) {
    notFound();
  }

  return (
    <DashboardContent>
      <DashboardHeader>
        <DashboardTitle>
          Мои предметы/{subject.name}/{group.name}
        </DashboardTitle>
      </DashboardHeader>
      <DataTable
        columns={columns}
        data={group.students}
      />
    </DashboardContent>
  );
}
