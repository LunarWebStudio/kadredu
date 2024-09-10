"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import Combobox from "~/components/ui/combobox";
import UserRoleBadge from "~/components/ui/user-role";
import { GetRoleData } from "~/lib/shared/enums";
import type { User } from "~/lib/shared/types/user";
import { rolesEnum } from "~/server/db/schema";
import { api } from "~/trpc/react";

export default function UpdateRole({
  user,
}: {
  user: User;
}) {
  const router = useRouter();
  const updateRolesMutation = api.user.updateRoles.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      toast.error("Ошибка", {
        description: error.message,
      });
    },
  });

  return (
    <Combobox
      values={rolesEnum.enumValues.map((r) => ({
        id: r,
        name: GetRoleData(r).name,
      }))}
      value={null}
      placeholder={{
        default: "Выберите роль",
        empty: "Ролей не найдено",
      }}
      onChange={(v) => {
        if (!v) return;

        let newRoles = user.roles;
        if (newRoles.includes(v?.id)) {
          newRoles = newRoles.filter((r) => r !== v?.id);
        } else {
          newRoles = [...newRoles, v?.id];
        }

        updateRolesMutation.mutate({
          id: user.id,
          roles: newRoles,
        });
      }}
    >
      <Button
        variant="table_selector"
        size="table_selector"
        chevron
        loading={updateRolesMutation.isPending}
      >
        <div className="flex flex-row gap-2">
          {user.roles.map((role) => (
            <UserRoleBadge
              key={user.id + role}
              userRole={role}
              size={user.roles.length === 1 ? "regular" : "small"}
            />
          ))}
        </div>
      </Button>
    </Combobox>
  );
}
