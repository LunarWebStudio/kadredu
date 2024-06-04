import DashboardTemplate from "~/app/dashboard/templ";
import CreateUpdateBuilding from "~/app/dashboard/(admin)/buildings/create_update";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { api } from "~/trpc/server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import DeleteBuilding from "~/app/dashboard/(admin)/buildings/delete";

export default async function Buildings({
  searchParams
}: {
  searchParams: {
    search?: string;
  }
}) {
  const buildings = await api.building.getAll({
    search: searchParams.search
  });

  return (
    <DashboardTemplate
      navbar={<CreateUpdateBuilding />}
      title="Сп"
    >
      <div className="max-h-full grow overflow-y-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Группы</TableHead>
              <TableHead>Адрес</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buildings.map(building => (
              <TableRow key={building.id}>
                <TableCell>{building.title}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/groups?building=${building.id}`}>
                    <Button
                      size="link"
                      variant="link"
                    >
                      {building.groups.length}
                    </Button>
                  </Link>
                </TableCell>
                <TableCell>{building.address}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <CreateUpdateBuilding building={building} />
                        <DeleteBuilding building={building} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardTemplate>
  );
}
