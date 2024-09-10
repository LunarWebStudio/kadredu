"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { TeamRole } from "~/lib/shared/types/role";
import CreateUpdateRole from "./create_update";
import DeleteRole from "./delete";

export const columns: ColumnDef<TeamRole>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    id: "actions",
    header: "",
    cell({ row }) {
      const role = row.original;

      return (
        <div className="flex items-center justify-end">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                aria-haspopup="true"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Действия</DropdownMenuLabel>
              <CreateUpdateRole role={role} />
              <DeleteRole role={role} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
