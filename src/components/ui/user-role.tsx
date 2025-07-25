import { GetRoleData } from "~/lib/shared/enums";
import { cn } from "~/lib/utils";
import type { Role } from "~/server/db/schema";

export default function UserRoleBadge({
  userRole,
  size,
}: {
  userRole: Role | undefined;
  size: "small" | "regular";
}) {
  const data = GetRoleData(userRole);

  return (
    <div
      className={cn(
        data.className,
        "px-2.5 py-1 text-xs border-2 rounded-md w-fit",
      )}
    >
      {data.emoji} {size === "regular" && data.name}
    </div>
  );
}
