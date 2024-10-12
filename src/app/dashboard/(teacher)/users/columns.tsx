"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import Avatar from "~/components/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import type { User } from "~/lib/shared/types/user";
import { api } from "~/trpc/react";
import DeleteUser from "./delete";
import GrantCoins from "./grant_coins";
import GrantExperience from "./grant_experience";
import UpdateGroup from "./update_group";
import UpdateRole from "./update_role";
import GrantAchievement from "./grant_achievement";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "ФИО",
    cell({ cell, row }) {
      const name = cell.getValue() as User["name"];
      return (
        <div className="flex items-center gap-2">
          <Avatar
            className="size-10"
            image={row.original.image?.id}
            name={row.original.name ?? "?"}
          />
          <p>{name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "group.name",
    header: "Группа",
    cell({ row }) {
      return <UpdateGroup user={row.original} />;
    },
  },
  {
    accessorKey: "roles",
    header: "Роли",
    cell({ row }) {
      return <UpdateRole user={row.original} />;
    },
  },
  {
    id: "actions",
    header: "",
    cell({ row }) {
      const { data: session, isLoading } = api.user.session.useQuery();
      const user = row.original;

      if (isLoading) {
        return (
          <div className="flex items-center justify-end">
            <Skeleton className="size-10" />
          </div>
        );
      }

      return (
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
              {session?.session.user.roles.includes("ADMIN") && (
                <>
                  <GrantCoins userId={user.id} />
                  <GrantExperience userId={user.id} />
                  <GrantAchievement userId={user.id} />
                </>
              )}
              <DropdownMenuSeparator />
              {user.username && (
                <DropdownMenuItem>
                  <Link href={`/@${user.username}`}>Профиль</Link>
                </DropdownMenuItem>
              )}
              <DeleteUser user={user} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
