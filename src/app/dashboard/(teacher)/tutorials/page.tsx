import DashboardTemplate from "~/app/dashboard/templ";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import DeleteTutorial from "~/app/dashboard/(teacher)/tutorials/delete";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/server";

export default async function Tutorials({
  searchParams,
}: {
  searchParams: {
    search?: string;
  };
}) {
  const tutorials = await api.tutorial.getAll({
    search: searchParams.search,
  });

  return (
    <DashboardTemplate
      navbar={
        <Button>
          <Link href="/dashboard/tutorials/create">Добавить</Link>
        </Button>
      }
      title="Туториалы"
    >
      <div className="max-h-full grow overflow-y-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Автор</TableHead>
              <TableHead>Предмет</TableHead>
              <TableHead>Дата создания</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tutorials.map((tutorial) => (
              <TableRow key={tutorial.id}>
                <TableCell>{tutorial.name}</TableCell>

                <TableCell>{tutorial.author.username}</TableCell>

                <TableCell>
                  {tutorial.subjectId ? (
                    tutorial.subject?.name
                  ) : (
                    <p>Предмет не указан</p>
                  )}
                </TableCell>

                <TableCell>
                  {format(tutorial.createdAt ?? "", "PPP", { locale: ru })}
                </TableCell>

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
                        <DeleteTutorial tutorial={tutorial} />
                        <DropdownMenuItem>
                          <Link href={`/dashboard/tutorials/${tutorial.id}`}>
                            Редактировать
                          </Link>
                        </DropdownMenuItem>
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
