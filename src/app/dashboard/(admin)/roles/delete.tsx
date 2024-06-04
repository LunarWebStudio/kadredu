"use client";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTrigger
} from "~/components/ui/alert-dialog";
import { DialogFooter } from "~/components/ui/dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function DeleteDialog({
  role
}: {
  role: { id: string, name: string }
}) {
  const router = useRouter();
  const DeleteRoleMutation = api.teamRoles.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Роль удалена"
      });
      router.refresh();
    },
    onError: err => {
      toast({
        title: "Ошибка обновления роли",
        description: err.message,
        variant: "destructive"
      });
      router.refresh();
    }
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={e => {
            e.preventDefault();
          }}
        >
          Удалить
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>Удаление роли</AlertDialogHeader>
        <AlertDialogDescription>
          Вы уверены что хотите удалить `{role.name}`?
        </AlertDialogDescription>
        <DialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={false}
            onClick={() => {
              DeleteRoleMutation.mutate({ id: role.id });
            }}
          >
            Удалить
          </AlertDialogAction>
        </DialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
