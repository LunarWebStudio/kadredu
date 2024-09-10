"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import type { Topic } from "~/lib/shared/types/topic";
import { api } from "~/trpc/react";

export default function DeleteTopic({ topic }: { topic: Topic }) {
  const router = useRouter();

  const deleteTopicMutation = api.topic.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (err) => {
      toast.error("Ошибка", {
        description: err.message,
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
          <AlertDialogTitle>Удаление темы</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Вы уверены что хотите удалить "{topic.name}"?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteTopicMutation.isPending}
            onClick={() => deleteTopicMutation.mutate({ id: topic.id })}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
