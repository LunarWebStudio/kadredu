"use client";

import { Search as SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newSearchParams = new URLSearchParams(searchParams);
      for (const [key, value] of searchParams) {
        if (key !== "search") {
          newSearchParams.set(key, value);
        }
      }
      newSearchParams.set("search", query);
      if (!query) {
        newSearchParams.delete("search");
      }
      router.push(`${pathname}?${newSearchParams.toString()}`);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [query, pathname, searchParams, router]);

  return (
    <div className="relative grow md:w-[18rem]">
      <div className="absolute left-0 top-0 flex aspect-square h-10 items-center justify-center">
        <SearchIcon className="size-4" />
      </div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск"
        className="w-full pl-8"
      />
    </div>
  );
}
