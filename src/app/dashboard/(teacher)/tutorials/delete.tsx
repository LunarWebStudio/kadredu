"use client";

import { useRouter } from "next/navigation";
import { type Tutorial } from "~/lib/shared/types";
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

export default function DeleteTutorial({ tutorial }: { tutorial: Tutorial }) {
  const router = useRouter();
  const { toast } = useToast();

  const deleteTutorialMutation = api.tutorial.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Туториал удален"
      });
      router.refresh();
    },
    onError: err => {
      toast({
        title: "Ошибка удаления туториала",
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
          <AlertDialogTitle>Удаление туториала</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Вы уверены что хотите удалить "{tutorial.name}"?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteTutorialMutation.isPending}
            onClick={() => deleteTutorialMutation.mutate({ id: tutorial.id })}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
