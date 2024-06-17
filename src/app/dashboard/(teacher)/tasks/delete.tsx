"use client";

import { useRouter } from "next/navigation";
import { type Task } from "~/lib/shared/types";
import { api } from "~/trpc/react";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogTrigger
} from "~/components/ui/alert-dialog";
import { useToast } from "~/components/ui/use-toast";

export default function DeleteTask({ task }: { task: Task }) {
  const router = useRouter();
  const { toast } = useToast();

  const deleteTaskMutation = api.task.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Задание удалено"
      });
      router.refresh();
    },
    onError: err => {
      toast({
        title: "Ошибка удаления задания",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={e => e.preventDefault()}>
          Удалить
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удаление задания</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Вы уверены что хотите удалить "{task.name}"?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteTaskMutation.isPending}
            onClick={() => deleteTaskMutation.mutate({ id: task.id })}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
