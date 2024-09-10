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
import type { Subject } from "~/lib/shared/types/subject";
import CreateUpdateSubject from "./create_update";
import DeleteSubject from "./delete";

export const columns: ColumnDef<Subject>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "teacher.name",
    header: "Преподаватель",
  },
  {
    accessorKey: "building.name",
    header: "СП",
  },
  {
    id: "actions",
    header: "",
    cell({ row }) {
      const subject = row.original;

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
              <CreateUpdateSubject subject={subject} />
              <DeleteSubject subject={subject} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
