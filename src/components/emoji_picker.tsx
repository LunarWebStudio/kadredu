"use client";

import data from "@emoji-mart/data";
import i18n from "@emoji-mart/data/i18n/ru";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";
import { type ReactNode, useState } from "react";
import { Popover, PopoverContent } from "~/components/ui/popover";

export default function EmojiPicker({
  setEmoji,
  children,
}: {
  setEmoji: (emoji: string) => void;
  children: ReactNode;
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Popover
      modal={true}
      open={open}
      onOpenChange={setOpen}
    >
      {children}

      <PopoverContent className="size-fit">
        <Picker
          data={data}
          onEmojiSelect={(val: { native: string }) => {
            setEmoji(val.native);
            setOpen(false);
          }}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          i18n={i18n}
          theme={theme.resolvedTheme}
        />
      </PopoverContent>
    </Popover>
  );
}
