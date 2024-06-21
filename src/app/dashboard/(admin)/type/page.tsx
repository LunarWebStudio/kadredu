import DashboardTemplate from "~/app/dashboard/templ";

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
import CreateUpdateEventType from "~/app/dashboard/(admin)/type/create_update";
import DeleteEventType from "~/app/dashboard/(admin)/type/delete";

export default async function Themes({
  searchParams
}: {
  searchParams: {
    search?: string
  }
}) {
  const eventTypes = await api.eventType.getAll({
    search: searchParams.search
  });

  return (
    <DashboardTemplate
      navbar={<CreateUpdateEventType />}
      title="Тип мероприятия"
    >
      <div className="max-h-full grow overflow-y-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {eventTypes.map(eventType => (
              <TableRow key={eventType.id}>
                <TableCell>{eventType.name}</TableCell>

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
                        <CreateUpdateEventType type={eventType}/>
                        <DeleteEventType type={eventType}/>
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
