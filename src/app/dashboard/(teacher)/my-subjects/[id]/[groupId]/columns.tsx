"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "~/components/avatar";
import { Button } from "~/components/ui/button";
import { AppRouter } from "~/server/api/root";

type Student = NonNullable<
  inferProcedureOutput<AppRouter["subject"]["getStudents"]>
>["building"]["groups"][number]["students"][number];

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "ФИО",
    cell({ row, cell }) {
      const name = cell.getValue() as Student["name"];

      return (
        <div className="flex items-center gap-2">
          <Avatar
            className="size-10"
            image={row.original.image?.id}
            name={row.original.name ?? "?"}
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
      const id = cell.getValue() as Student["id"];
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
