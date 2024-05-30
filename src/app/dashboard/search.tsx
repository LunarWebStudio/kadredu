import { Input } from "~/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <div className="relative">
      <div className="absolute left-0 top-0 flex aspect-square h-10 items-center justify-center">
        <SearchIcon className="size-4" />
      </div>
      <Input
        placeholder="Поиск"
        className="w-[18rem] pl-8"
      />
    </div>
  );
}
