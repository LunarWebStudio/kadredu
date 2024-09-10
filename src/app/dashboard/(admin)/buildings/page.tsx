import CreateUpdateBuilding from "~/app/dashboard/(admin)/buildings/create_update";
import {
  DashboardContent,
  DashboardHeader,
  DashboardTitle,
} from "~/components/ui/dashboard";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/server";
import { columns } from "./columns";

export default async function Buildings() {
  const buildings = await api.building.getAll();

  return (
    <DashboardContent>
      <DashboardHeader>
        <DashboardTitle>СП</DashboardTitle>
        <CreateUpdateBuilding />
      </DashboardHeader>
      <DataTable
        columns={columns}
        data={buildings}
      />
    </DashboardContent>
  );
}
