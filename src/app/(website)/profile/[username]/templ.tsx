import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export default function ProfileTemplate({
  title,
  className,
  navbar,
  children,
}: {
  title: string;
  className: string;
  navbar?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grow space-y-5">
      <div className="flex w-full flex-row justify-between">
        <div className="space-y-1">
          <h3>{title}</h3>
          <div className={cn("h-0.5 w-8", className)}></div>
        </div>
        {navbar}
      </div>
      {children}
    </div>
  );
}
