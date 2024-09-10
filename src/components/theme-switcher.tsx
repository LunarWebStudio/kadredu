"use client";

import { useTheme } from "next-themes";
import { Switch } from "~/components/ui/switch";

export default function ThemeSwitch() {
  const theme = useTheme();

  return (
    <Switch
      checked={theme.theme === "dark"}
      onCheckedChange={(checked) => {
        if (checked) {
          theme.setTheme("dark");
        } else {
          theme.setTheme("light");
        }
      }}
    />
  );
}
