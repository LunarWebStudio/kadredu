import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full space-y-4 p-6">
      <Skeleton className="h-60 w-full rounded-md" />
      <Skeleton className="h-40 w-full rounded-md" />
      <Skeleton className="h-40 w-full rounded-md" />
      <Skeleton className="h-60 w-full rounded-md" />
    </div>
  );
}
