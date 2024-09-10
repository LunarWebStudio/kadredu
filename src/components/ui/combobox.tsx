"use client";

import { Check } from "lucide-react";
import { type ReactNode, useState } from "react";
import { cn } from "~/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type Item = {
  id: string;
  name: string;
};

export default function Combobox<T extends Item>({
  values,
  value,
  onChange,
  children,
  includeAll = false,
  placeholder,
}: {
  values: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder: {
    default: string;
    empty: string;
  };
  includeAll?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder={placeholder.default} />
          <CommandEmpty className="text-muted-foreground">
            {placeholder.empty}
          </CommandEmpty>

          <CommandList>
            <CommandGroup>
              {includeAll && (
                <CommandItem
                  value={undefined}
                  onSelect={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "size-4 mr-2",
                      !value ? "opacity-50" : "opacity-0",
                    )}
                  />
                  Все
                </CommandItem>
              )}
              {values.map((v) => (
                <CommandItem
                  value={v.name}
                  key={v.id}
                  onSelect={() => {
                    onChange(v);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "size-4 mr-2",
                      v.id === value?.id ? "opacity-50" : "opacity-0",
                    )}
                  />
                  {v.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
