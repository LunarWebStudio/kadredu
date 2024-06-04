"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/ui/select";
import { type Group } from "~/lib/shared/types";

export default function GroupFilter({
  groups
}: {
  groups: Group[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [groupId, setGroupId] = useState<string | null>();

  useEffect(() => {
    if (!groupId) return;

    const newSearchParams = new URLSearchParams(searchParams);
    for (const [key, value] of searchParams) {
      if (key !== "groupId") newSearchParams.set(key, value);
    }
    newSearchParams.set("groupId", groupId);
    if (groupId === "all") {
      newSearchParams.delete("groupId");
    }

    router.push(`${pathname}?${newSearchParams.toString()}`);
  }, [groupId, pathname, router, searchParams])

  return (
    <Select value={searchParams.get("groupId") ?? "all"} onValueChange={setGroupId}>
      <SelectTrigger className="bg-transparent border-0 px-2 w-fit gap-4 focus:ring-0 focus:ring-offset-0">
        ГРУППА
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Все</SelectItem>
        <SelectItem value="unknown">
          Не назначено
        </SelectItem>
        {groups.map(group => (
          <SelectItem key={group.id} value={group.id} >
            {group.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
