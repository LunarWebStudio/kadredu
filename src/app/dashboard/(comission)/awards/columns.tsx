'use client'
import { ColumnDef } from "@tanstack/react-table";
import { Coins, ExpandIcon, MoreHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Achievement } from "~/lib/shared/types/achievements";
import CreateUpdateAwards from "./create_update";
import DeleteAchievement from "./delete";
import Image from "~/components/ui/image";
import { eventTypes } from "~/lib/shared/types/achievements";





export const columns: ColumnDef<Achievement>[] = [
  {
    accessorKey:"name",
    header: "Название",
    cell({ cell, row}) {
      const name = cell.getValue() as Achievement["name"];
      return (
        <div className="flex items-center gap-2">
          <Image
            src={row.original.imageId}
            alt={row.original.name}
            width={500}
            height={500}
            className="size-12 rounded-xl"
          />
          <p>{name}</p>
        </div>
      )
    },
  },
  {
    accessorKey:"eventType",
    header: "Тип события",
    cell({ cell }) {
      const event = cell.getValue() as Achievement["eventType"];
      return (
        <p>{eventTypes[event]}</p>
      )
    }
  },
  {
    accessorKey:"eventAmount",
    header: "Количество событий",
  },
  {
    accessorKey:"experience",
    header: "Опыт",
  },
  {
    accessorKey:"coins",
    header: "Монеты",
  },
  {
    id:"actions",
    header: "",
    cell({row}) {
      const achievement = row.original;
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
              <CreateUpdateAwards achievement={achievement} />
              <DeleteAchievement achievement={achievement} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  }
]





