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
import Link from "next/link";

export default async function Tasks({
    searchParams
} : {
    searchParams: {
      search?: string
    }
}) {

    const tasks = await api.task.getAll({
        search: searchParams.search
    })


    return (
        <DashboardTemplate
            navbar={
                <Button>
                    <Link href="/dashboard/tasks/create">Добавить</Link>
                </Button>
            }
            title="Задания"
        >
            <div className="max-h-full grow overflow-y-scroll">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Название</TableHead>
                        <TableHead>Дедлайн</TableHead>
                        <TableHead>Описание</TableHead>
                        <TableHead>Предмет</TableHead>
                        <TableHead>Туториал</TableHead>
                        <TableHead>Опыт</TableHead>
                        <TableHead>Монеты</TableHead>
                    </TableRow>
                    </TableHeader>
        
                    <TableBody>
                        {tasks.map(task => (
                            <TableRow key={task.id}>
                                <TableCell>
                                    {task.name}
                                </TableCell>

                                <TableCell>
                                    {task.deadline}
                                </TableCell>

                                <TableCell>
                                    {task.description}
                                </TableCell>

                                <TableCell>
                                    {task.subject}
                                </TableCell>

                                <TableCell>
                                    {task.tutorial}
                                </TableCell>

                                <TableCell>
                                    {task.coin}
                                </TableCell>

                                <TableCell>
                                    {task.subject}
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