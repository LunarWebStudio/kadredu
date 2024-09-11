import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export interface ProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function ProfileContent({ children, ...props }: ProfileProps) {
  return (
    <div
      className="grow space-y-6"
      {...props}
    >
      {children}
    </div>
  );
}

export function ProfileHeader({ children, ...props }: ProfileProps) {
  return (
    <div
      className="flex w-full flex-row justify-between"
      {...props}
    >
      {children}
    </div>
  );
}

export function ProfileTitle({ children, className, ...props }: ProfileProps) {
  return (
    <div
      className="space-y-1"
      {...props}
    >
      <h3>{children}</h3>
      <div className={cn("h-0.5 w-8", className)}></div>
    </div>
  );
}
