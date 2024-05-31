import DashboardTemplate from "~/app/dashboard/templ";
import CreateUpdateGroup from "~/app/dashboard/(admin)/groups/create_update";
import DeleteGroup from "~/app/dashboard/(admin)/groups/delete";
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
import S3Image from "~/components/s3Image";

export default async function Groups() {
  const groups = await api.group.getAll();
  const buildings = await api.building.getAll();

  return (
    <DashboardTemplate
      navbar={<CreateUpdateGroup buildings={buildings} />}
      title="Группы"
    >
      <div className="max-h-full grow overflow-y-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Фото</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>СП</TableHead>
              <TableHead>Люди</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map(group => (
              <TableRow key={group.id}>
                <TableCell>
                  <S3Image
                    src={group.image.storageId}
                    alt={group.title}
                    width={500}
                    height={500}
                    className="size-14 object-contain"
                  />
                </TableCell>
                <TableCell>{group.title}</TableCell>
                <TableCell>
                  {group.building.title}
                </TableCell>
                <TableCell>{group.users.length}</TableCell>
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
                        <CreateUpdateGroup group={group} buildings={buildings} />
                        <DeleteGroup group={group} />
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
