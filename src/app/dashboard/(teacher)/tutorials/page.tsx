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

    return (
        <DashboardTemplate
            navbar={<CreateUpdateTutorial topics={topics}/>}
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
                                    {tutorial.authorId}
                                </TableCell>

                                <TableCell>
                                    {tutorial.topic}
                                </TableCell>

                                <TableCell>
                                    {tutorial.price}
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