"use client";

import { useRouter } from "next/navigation";
import { type TypeEvent } from "~/lib/shared/types";
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

export default function DeleteType({ type }: { type: TypeEvent }) {
  const router = useRouter();
  const { toast } = useToast();

  const deleteTypeMutation = api.type.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Тип мероприятия удален"
      });
      router.refresh();
    },
    onError: err => {
      toast({
        title: "Ошибка удаления типа мероприятия",
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
          <AlertDialogTitle>Удаление типа мероприятия</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Вы уверены что хотите удалить "{type.name}"?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteTypeMutation.isPending}
            onClick={() => deleteTypeMutation.mutate({ id: type.id })}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
