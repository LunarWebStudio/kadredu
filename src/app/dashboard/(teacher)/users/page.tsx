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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import S3Image from "~/components/s3Image";
import { Skeleton } from "~/components/ui/skeleton";
import GroupSelect from "~/app/dashboard/(teacher)/users/group_select";
import RoleSelect from "~/app/dashboard/(teacher)/users/role_select";
import { getServerAuthSession } from "~/server/auth";
import DeleteUser from "~/app/dashboard/(teacher)/users/delete";
import Link from "next/link";
import { type Role } from "~/server/db/schema";
import GroupFilter from "~/app/dashboard/(teacher)/users/group_filter";
import RoleFilter from "~/app/dashboard/(teacher)/users/role_filter";

export default async function Users({
  searchParams
}: {
  searchParams: {
    groupId?: string;
    role?: string;
  }
}) {
  const session = await getServerAuthSession();
  const users = await api.user.getAll({
    groupIds: searchParams.groupId ? [searchParams.groupId] : undefined,
    roles: searchParams.role ? [searchParams.role as Role] : undefined
  });
  const groups = await api.group.getAll();

  return (
    <DashboardTemplate
      navbar={null}
      title="Пользователи"
    >
      <div className="max-h-full grow overflow-y-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Фото</TableHead>
              <TableHead>ФИО</TableHead>
              <TableHead>НИК</TableHead>
              <TableHead>
                <GroupFilter groups={groups} />
              </TableHead>
              <TableHead>
                <RoleFilter />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.profilePicture ? (
                    <S3Image
                      src={user.profilePicture.storageId}
                      blurDataURL={user.profilePicture.blurPreview}
                      alt={user.name ?? "Не указано"}
                      width={500}
                      height={500}
                      className="size-14 object-contain"
                    />
                  ) : (
                    <Skeleton className="size-14 rounded-md" />
                  )}
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username ?? "Не указано"}</TableCell>
                <TableCell>
                  <GroupSelect user={user} groups={groups} />
                </TableCell>
                <TableCell>
                  <RoleSelect user={user} session={session!} />
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
                        <DropdownMenuItem>
                          Выдать награду
                        </DropdownMenuItem>
                        {user.username && (
                          <DropdownMenuItem>
                            <Link href={`/@${user.username}`}>
                              Профиль
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DeleteUser user={user} />
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
