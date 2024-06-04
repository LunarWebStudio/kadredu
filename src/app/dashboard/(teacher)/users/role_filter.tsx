"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/ui/select";
import UserRoleBadge from "~/components/user-role";
import { rolesEnum } from "~/server/db/schema";

export default function RoleFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [role, setRole] = useState<string | null>();

  useEffect(() => {
    if (!role) return;

    const newSearchParams = new URLSearchParams(searchParams);
    for (const [key, value] of searchParams) {
      if (key !== "role") newSearchParams.set(key, value);
    }
    newSearchParams.set("role", role);
    if (role === "all") {
      newSearchParams.delete("role");
    }

    router.push(`${pathname}?${newSearchParams.toString()}`);
  }, [role, pathname, router, searchParams])

  return (
    <Select value={searchParams.get("role") ?? "all"} onValueChange={setRole}>
      <SelectTrigger className="bg-transparent border-0 p-0 w-fit focus:ring-0 focus:ring-offset-0">
        РОЛЬ
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Все</SelectItem>
        {rolesEnum.enumValues.map(role => (
          <SelectItem key={role} value={role} >
            <UserRoleBadge role={role} size="regular" />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
