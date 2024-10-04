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
import Image from "~/components/ui/image";
import type { Group } from "~/lib/shared/types/group";
import CreateUpdateGroup from "./create_update";
import DeleteGroup from "./delete";

export const columns: ColumnDef<Group>[] = [
  {
    accessorKey: "name",
    header: "Название",
    cell({ cell, row }) {
      const name = cell.getValue() as Group["name"];
      return (
        <div className="flex items-center gap-2">
          <Image
            src={row.original.image.id}
            alt={row.original.name}
            width={500}
            height={500}
            className="size-12 rounded-xl"
          />
          <p>{name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "building.name",
    header: "СП",
  },
  {
    accessorKey: "students",
    header: "Люди",
    cell({ cell }) {
      const students = cell.getValue() as Group["students"];
      return students?.length.toString();
    },
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
              <CreateUpdateGroup group={topic} />
              <DeleteGroup group={topic} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
