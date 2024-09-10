import {
  DashboardContent,
  DashboardHeader,
  DashboardTitle,
} from "~/components/ui/dashboard";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/server";
import { columns } from "./columns";
import { notFound } from "next/navigation";
import CreateUpdateTask from "./create_update";

export default async function SubjectsPage({
  params,
}: {
  params: {
    subjectId: string;
  };
}) {
  const subject = await api.subject.getOne({
    id: params.subjectId,
  });

  if (!subject) {
    notFound();
  }

  const tasks = await api.task.getAll({
    id: params.subjectId,
  });

  return (
    <DashboardContent>
      <DashboardHeader>
        <DashboardTitle>Задания/{subject.name}</DashboardTitle>
        <CreateUpdateTask />
      </DashboardHeader>
      <DataTable
        columns={columns}
        data={tasks}
      />
    </DashboardContent>
  );
}
