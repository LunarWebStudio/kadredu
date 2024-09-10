import CreateUpdateTopic from "~/app/dashboard/(admin)/topics/create_update";
import {
  DashboardContent,
  DashboardHeader,
  DashboardTitle,
} from "~/components/ui/dashboard";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/server";
import { columns } from "./columns";

export default async function Topics() {
  const topics = await api.topic.getAll();

  return (
    <DashboardContent>
      <DashboardHeader>
        <DashboardTitle>Темы</DashboardTitle>
        <CreateUpdateTopic />
      </DashboardHeader>
      <DataTable
        columns={columns}
        data={topics}
      />
    </DashboardContent>
  );
}
