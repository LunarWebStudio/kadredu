import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="h-full grow space-y-8 overflow-hidden bg-muted/40 p-6">
      <div className="flex w-full justify-between gap-4">
        <Skeleton className="h-10 w-40 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-md" />
        <Separator />
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <div key={index}>
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
      </div>
    </div>
  );
}
