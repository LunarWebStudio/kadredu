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
import { Tutorial } from "~/lib/shared/types/tutorial";
import CreateUpdateTutorial from "./create_update";
import Image from "~/components/ui/image";
import DeleteTutorial from "./delete";
import { api } from "~/trpc/react";

export const columns: ColumnDef<Tutorial>[] = [
  {
    accessorKey: "name",
    header: "Название",
    cell({ row }) {
      const tutorial = row.original;

      return (
        <div className="flex items-center gap-2">
          <Image
            src={tutorial.image.id}
            alt={tutorial.name}
            width={500}
            height={500}
            className="aspect-[2/1] object-cover w-36 rounded-md"
          />
          <p>{tutorial.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "author.name",
    header: "Автор",
  },
  {
    id: "actions",
    header: "",
    cell({ row }) {
      const [{ session }] = api.user.session.useSuspenseQuery();

      const tutorial = row.original;

      return (
        <div className="flex items-center justify-end">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                aria-haspopup="true"
                disabled={tutorial.author.id !== session.user.id}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Действия</DropdownMenuLabel>
              <CreateUpdateTutorial tutorial={tutorial} />
              <DeleteTutorial tutorial={tutorial} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
