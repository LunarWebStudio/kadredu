import { type ReactNode } from "react";

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return <main className="bg-background dark:bg-background">{children}</main>;
}
