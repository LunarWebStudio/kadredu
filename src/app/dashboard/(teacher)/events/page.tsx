import DashboardTemplate from "~/app/dashboard/templ";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
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
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import S3Image from "~/components/s3Image";
import { Skeleton } from "~/components/ui/skeleton";
import DeleteEvent from "~/app/dashboard/(teacher)/events/delete";

export default async function Events({
    searchParams
} : {
    searchParams: {
      search?: string
    }
}) {

    const events = await api.event.getAll({
        search: searchParams.search
    })


    return (
        <DashboardTemplate
            navbar={
                <Button>
                    <Link href="/dashboard/events/create">Добавить</Link>
                </Button>
            }
            title="Мероприятия"
        >
            <div className="max-h-full grow overflow-y-scroll">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Фото</TableHead>
                            <TableHead>Название</TableHead>
                            <TableHead>Дата</TableHead>
                            <TableHead>Тип</TableHead>
                        </TableRow>
                    </TableHeader>
        
                    <TableBody>
                        {events.map(event => (
                            <TableRow key={event.id}>
                                <TableCell>
                                    {event.image ? (
                                        <S3Image
                                        src={event.image.storageId}
                                        blurDataURL={event.image.blurPreview}
                                        alt={event.name ?? "Не указано"}
                                        width={500}
                                        height={500}
                                        className="size-14 object-contain"
                                        />
                                    ) : (
                                        <Skeleton className="size-14 rounded-md" />
                                    )}
                                </TableCell>

                                <TableCell>
                                    {event.name}
                                </TableCell>

                                <TableCell>
                                    {event.dateStart ? format(event.dateStart, "PPP", { locale: ru }) : "Не указан"}
                                </TableCell>

                                <TableCell>
                                    {event.type?.name}
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

                                                <DeleteEvent event={event}/>

                                                <DropdownMenuItem>
                                                    <Link href={`/dashboard/events/${event.id}`}>Редактировать</Link>
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
    )
}