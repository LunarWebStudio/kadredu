"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useToast } from "~/components/ui/use-toast";
import { type Group, type User } from "~/lib/shared/types";
import { api } from "~/trpc/react";

export default function GroupSelect({
  user,
  groups,
}: {
  user: User;
  groups: Group[];
}) {
  const [newGroupId, setNewGroupId] = useState(user.group?.id);

  const router = useRouter();
  const { toast } = useToast();

  const updateGroupMutation = api.user.updateGroup.useMutation({
    onSuccess: () => {
      toast({
        title: "Группа обновлена",
      });
      router.refresh();
    },
    onError: (err) => {
      toast({
        title: "Ошибка обновления группы",
        description: err.message,
        variant: "destructive",
      });
    },
  })

  useEffect(() => {
    if (!newGroupId) return;
    if (user.group?.id === newGroupId) return;

    updateGroupMutation.mutate({ id: user.id, groupId: newGroupId })
  })

  return (
    <Select value={newGroupId} onValueChange={setNewGroupId}>
      <SelectTrigger className="bg-transparent border-0 p-0 w-fit gap-4">
        <SelectValue placeholder="Не назначено" />
      </SelectTrigger>
      <SelectContent>
        {groups.map(group => (
          <SelectItem key={group.id} value={group.id}>
            {group.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
