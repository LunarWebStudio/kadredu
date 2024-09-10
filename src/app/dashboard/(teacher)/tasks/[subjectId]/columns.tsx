"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { OneTask, Task } from "~/lib/shared/types/task";
import CreateUpdateTask from "./create_update";
import DeleteTask from "./delete";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "deadline",
    header: "Срок сдачи",
    cell({ cell }) {
      const deadline = cell.getValue() as Task["deadline"];
      if (!deadline) {
        return "Без ограничений";
      }

      return format(deadline, "dd.MM");
    },
  },
  {
    accessorKey: "coins",
    header: "Монеты",
  },
  {
    accessorKey: "experience",
    header: "Опыт",
  },
  {
    id: "actions",
    header: "",
    cell({ row }) {
      const task = row.original;

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
              <CreateUpdateTask task_id={task.id} />
              <DeleteTask task={task} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
