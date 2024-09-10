"use client";

import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { useToast } from "~/components/ui/use-toast";
import type { Group } from "~/lib/shared/types";
import { api } from "~/trpc/react";

export default function DeleteGroup({
  group,
}: {
  group: Group;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const deleteGroupMutation = api.group.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Группа удалена",
      });
      router.refresh();
    },
    onError: (err) => {
      toast({
        title: "Ошибка удаления группы",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Удалить
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удаление группы</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Вы уверены что хотите удалить "{group.title}"?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteGroupMutation.isPending}
            onClick={() => deleteGroupMutation.mutate({ id: group.id })}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
