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
import CreateUpdateTopics from "~/app/dashboard/(admin)/topics/create_update";
import DeleteTopics from "~/app/dashboard/(admin)/topics/delete";

export default async function Themes({
  searchParams
} : {
  searchParams: {
    search?: string
  }
}) {

  const topics = await api.topic.getAll({
    search: searchParams.search
  });

  return (
    <DashboardTemplate
      navbar={<CreateUpdateTopics />}
      title="Тема"
    >
      <div className="max-h-full grow overflow-y-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {topics.map(topic => (
              <TableRow key={topic.id}>
                <TableCell>
                  {topic.name}
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
                        <CreateUpdateTopics topics={topic} />
                        <DeleteTopics topic={topic} />
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
  )
}
