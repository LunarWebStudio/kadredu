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
import CreateUpdateTopics from "./create_update";
import DeleteTopics from "./delete";

export default async function Themes() {
    const topics = await api.topics.getAll();
    const buildings = await api.building.getAll();

    return (
        <DashboardTemplate
          navbar={<CreateUpdateTopics  buildings={buildings} />}
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
                  <TableRow>
                    <TableCell>
                      {topic.nameTopics}
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
                            <CreateUpdateTopics topics={topic} buildings={buildings}/>
                            <DeleteTopics topic={topic}/>
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