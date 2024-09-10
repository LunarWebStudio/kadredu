"use client";
import { useRouter } from "next/navigation";
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
import { toast } from "~/components/ui/use-toast";
import type { Subject } from "~/lib/shared/types";
import { api } from "~/trpc/react";

export default function DeleteSubject({ subject }: { subject: Subject }) {
  const router = useRouter();
  const DeleteSubjectMutation = api.subject.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Предмет удалена",
      });
      router.refresh();
    },
    onError: (err) => {
      toast({
        title: "Ошибка удаления предмета",
        description: err.message,
        variant: "destructive",
      });
      router.refresh();
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
        <AlertDialogHeader>Удаление предмета</AlertDialogHeader>
        <AlertDialogDescription>
          Вы уверены что хотите удалить "{subject.name}" ?
        </AlertDialogDescription>
        <DialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={false}
            onClick={() => {
              DeleteSubjectMutation.mutate({ id: subject.id });
            }}
          >
            Удалить
          </AlertDialogAction>
        </DialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
