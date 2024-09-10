"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { DialogFooter } from "~/components/ui/dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/react";

export default function DeleteRole({
  role,
}: {
  role: { id: string; name: string };
}) {
  const router = useRouter();
  const deleteRoleMutation = api.teamRoles.delete.useMutation({
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
        <DropdownMenuItem
          onSelect={(e) => {
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
              deleteRoleMutation.mutate({ id: role.id });
            }}
          >
            Удалить
          </AlertDialogAction>
        </DialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
