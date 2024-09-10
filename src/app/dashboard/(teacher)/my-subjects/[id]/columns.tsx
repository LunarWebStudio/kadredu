"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import Image from "~/components/ui/image";
import { AppRouter } from "~/server/api/root";

type Group = NonNullable<
  inferProcedureOutput<AppRouter["subject"]["getGroups"]>
>["building"]["groups"][number];

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
    accessorKey: "students.length",
    header: "Студенты",
  },
  {
    id: "actions",
    header: "",
    accessorKey: "id",
    cell({ cell }) {
      const id = cell.getValue() as Group["id"];
      const pathname = usePathname();

      return (
        <div className="flex items-center justify-end">
          <Link href={`${pathname}/${id}`}>
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
