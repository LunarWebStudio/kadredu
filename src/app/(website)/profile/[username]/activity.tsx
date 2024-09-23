'use client'
import { api } from "~/trpc/react";



export function ActivityWiget({ username }: {
  username: string;
}) {
  const [] = api.github.getUserEvents.useSuspenseQuery({
    username
  })

  return (
    <div className="w-full rounded-xl bg-secondary">
      <div className="w-full px-6 py-4 border-b-2 text-lg font-bold text-muted-foreground">
        Активность
      </div>
    </div>
  );
}
