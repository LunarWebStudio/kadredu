"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import Combobox from "~/components/ui/combobox";
import { Skeleton } from "~/components/ui/skeleton";
import type { User } from "~/lib/shared/types/user";
import { api } from "~/trpc/react";

export default function UpdateGroup({
  user,
}: {
  user: User;
}) {
  const router = useRouter();
  const { data: groups, isLoading } = api.group.getAll.useQuery();

  const updateGroupMutation = api.user.updateGroup.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      toast.error("Ошибка", {
        description: error.message,
      });
    },
  });

  if (isLoading || !groups) {
    return <Skeleton className="h-10 w-36" />;
  }

  return (
    <Combobox
      values={groups}
      value={user.group ?? null}
      placeholder={{
        default: "Выберите группу",
        empty: "Группы не найдено",
      }}
      onChange={(v) => {
        if (!v) return;

        updateGroupMutation.mutate({
          id: user.id,
          groupId: v.id,
        });
      }}
    >
      <Button
        variant="table_selector"
        size="table_selector"
        loading={updateGroupMutation.isPending}
        chevron
      >
        {user.group?.name ?? "Не указано"}
      </Button>
    </Combobox>
  );
}
