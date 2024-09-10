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
import type { User } from "~/lib/shared/types";
import { api } from "~/trpc/react";

export default function DeleteUser({
  user,
}: {
  user: User;
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
