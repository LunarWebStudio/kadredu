"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import Image from "~/components/ui/image";
import { AppRouter } from "~/server/api/root";

type Subject = inferProcedureOutput<AppRouter["subject"]["getOwned"]>[number];

export const columns: ColumnDef<Subject>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "building.groups",
    header: "Группы",
    cell: ({ cell }) => {
      const groups = cell.getValue() as Subject["building"]["groups"];

      return (
        <HoverCard>
          <HoverCardTrigger className="cursor-help">
            {groups
              .slice(0, 3)
              .map((g) => g.name)
              .join(", ")}
            {groups.length > 3 && ` + ${groups.length - 3}`}
          </HoverCardTrigger>
          <HoverCardContent className="grid grid-cols-2 gap-6 w-fit max-w-screen">
            {groups.map((g) => (
              <div
                key={g.id}
                className="flex items-center gap-2"
              >
                <Image
                  src={g.image.id}
                  alt={g.name}
                  className="size-10 rounded-md"
                  width={400}
                  height={400}
                />
                <p>{g.name}</p>
              </div>
            ))}
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    id: "actions",
    header: "",
    accessorKey: "id",
    cell({ cell }) {
      const id = cell.getValue() as Subject["id"];
      return (
        <div className="flex items-center justify-end">
          <Link href={`/dashboard/my-subjects/${id}`}>
            <Button
              size="icon"
              variant="ghost"
            >
              <ChevronRight />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
