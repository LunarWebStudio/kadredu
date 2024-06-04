import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table";
import { api } from "~/trpc/server";
import DashboardTemplate from "~/app/dashboard/templ";
import CreateUpdateRole from "~/app/dashboard/(admin)/roles/create_update";
import { Button } from "~/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import DeleteDialog from "~/app/dashboard/(admin)/roles/delete";

export default async function Roles() {
  const roles = await api.rolesTeam.getAll();
  return (
    <DashboardTemplate
      title="Роли"
      navbar={<CreateUpdateRole></CreateUpdateRole>}
    >
      <div className="max-h-full grow overflow-y-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map(role => {
              return (
                <TableRow
                  key={role.id}
                  className=""
                >
                  <TableCell>{role.name}</TableCell>
                  <TableCell className="flex items-center justify-end">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-haspopup="true"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <CreateUpdateRole role={role}></CreateUpdateRole>
                        <DeleteDialog role={role}></DeleteDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </DashboardTemplate>
  );
}
