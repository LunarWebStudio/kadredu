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
import type { Topic } from "~/lib/shared/types/topic";
import CreateUpdateTopic from "./create_update";
import DeleteTopic from "./delete";

export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    id: "actions",
    header: "",
    cell({ row }) {
      const topic = row.original;

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
              <CreateUpdateTopic topic={topic} />
              <DeleteTopic topic={topic} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
