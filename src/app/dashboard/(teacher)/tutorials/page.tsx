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
import CreateUpdateTutorial from "~/app/dashboard/(teacher)/tutorials/create_update"; 
import DeleteTutorial from "./delete";

export default async function Tutorials({
    searchParams
} : {
    searchParams: {
      search?: string
    }
}) {

    const tutorials = await api.tutorial.getAll({
        search: searchParams.search
    })

    const topics = await api.topic.getAll();

    const subjects = await api.subject.getAll();

    return (
        <DashboardTemplate
            navbar={<CreateUpdateTutorial topics={topics} subjects={subjects}/>}
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
                        {tutorials.map(tutorial => (
                            <TableRow key={tutorial.id}>
                                <TableCell>
                                    {tutorial.name}
                                </TableCell>

                                <TableCell>
                                    {tutorial.authorInfo.email}
                                </TableCell>

                                <TableCell>
                                    {tutorial.subjectId ? (
                                        tutorial.subjectId
                                    ) : (
                                        <p>Предмет не указан</p>
                                    )}
                                </TableCell>

                                <TableCell>
                                    {tutorial.createDate?.toDateString()}
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
                                                <DeleteTutorial tutorial={tutorial}/>
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