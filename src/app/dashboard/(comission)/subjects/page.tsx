import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table";
import DashboardTemplate from "~/app/dashboard/templ";
import { api } from "~/trpc/server";
import CreateUpdateSubject from "~/app/dashboard/(comission)/subjects/create_update";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import DeleteSubject from "~/app/dashboard/(comission)/subjects/delete";

export default async function Subjects({
  searchParams
}: {
  searchParams: {
    search?: string
  }
}) {
  const subjects = await api.subject.getAll({ search: searchParams.search });
  const teachers = await api.user.getAll({
    roles: ["TEACHER"]
  });

  return (
    <DashboardTemplate
      title="Предмет"
      navbar={<CreateUpdateSubject teachers={teachers} />}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className=" w-2/12">Название</TableHead>
            <TableHead className=" w-2/6">Преподаватель</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map(subject => {
            return (
              <TableRow key={subject.id}>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.teacherInfo.name}</TableCell>
                <TableCell align="right">
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
                      <CreateUpdateSubject
                        subject={subject}
                        teachers={teachers}
                      />
                      <DeleteSubject subject={subject} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </DashboardTemplate>
  );
}
