import type { ReactNode } from "react";

export default function DashboardTemplate({
  title,
  navbar,
  children,
}: {
  title: string;
  navbar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex size-full h-full flex-col gap-4 rounded-xl bg-secondary p-6">
      <div className="flex w-full flex-row justify-between">
        <h4>{title}</h4>
        {navbar}
      </div>
      {children}
    </div>
  );
}

export interface DashboardProps {
  children: ReactNode;
}

export function DashboardContent({ children }: DashboardProps) {
  return (
    <div className="flex size-full h-full flex-col gap-4 rounded-xl bg-secondary p-6">
      {children}
    </div>
  );
}

export function DashboardHeader({ children }: DashboardProps) {
  return <div className="flex w-full flex-row justify-between">{children}</div>;
}

export function DashboardTitle({ children }: DashboardProps) {
  return <h4>{children}</h4>;
}
