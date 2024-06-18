"use client";

import { useRouter } from "next/navigation";
import { type Event } from "~/lib/shared/types";
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

export default function DeleteEvent({ event }: { event: Event }) {
  const router = useRouter();
  const { toast } = useToast();

  const deleteEventMutation = api.event.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Мероприятие удалено"
      });
      router.refresh();
    },
    onError: err => {
      toast({
        title: "Ошибка удаления мероприятия",
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
          <AlertDialogTitle>Удаление мероприятия</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Вы уверены что хотите удалить "{event.name}"?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteEventMutation.isPending}
            onClick={() => deleteEventMutation.mutate({ id: event.id })}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
