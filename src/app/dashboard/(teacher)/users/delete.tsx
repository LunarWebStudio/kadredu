"use client";

import { useRouter } from "next/navigation";
import { type User } from "~/lib/shared/types";
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

export default function DeleteUser({
  user
}: {
  user: User
}) {
  const router = useRouter();
  const { toast } = useToast();

  const deleteUserMutation = api.user.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Пользователь удален",
      });
      router.refresh();
    },
    onError: (err) => {
      toast({
        title: "Ошибка удаления пользователя",
        description: err.message,
        variant: "destructive",
      });
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={e => e.preventDefault()}>
          Удалить
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удаление пользователя</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Вы уверены что хотите удалить "{user.name}"?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteUserMutation.isPending}
            onClick={() => deleteUserMutation.mutate({ id: user.id })}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
