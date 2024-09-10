"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import CreateUpdateBuilding from "~/app/dashboard/(admin)/buildings/create_update";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { Building } from "~/lib/shared/types/building";
import DeleteBuilding from "./delete";

export const columns: ColumnDef<Building>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "groups",
    header: "Группы",
    cell({ cell }) {
      const groups = cell.getValue() as Building["groups"];
      return groups.length.toString();
    },
  },
  {
    accessorKey: "address",
    header: "Адрес",
  },
  {
    id: "actions",
    header: "",
    cell({ row }) {
      const building = row.original;

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
              <CreateUpdateBuilding building={building} />
              <DeleteBuilding building={building} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
