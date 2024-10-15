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
import { Achievement } from "~/lib/shared/types/achievements";
import { api } from "~/trpc/react";

export default function DeleteAchievement({ achievement }:
  {
    achievement:Achievement
  }) {
  const router = useRouter();

  const DeleteAchievementMutation = api.achievements.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Достижение удалено",
      });
      router.refresh();
    },
    onError: (err) => {
      toast({
        title: "Ошибка удаления достижения",
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
        <AlertDialogHeader>Удаление достижение</AlertDialogHeader>
        <AlertDialogDescription>
          Вы уверены что хотите удалить "{achievement.name}" ?
        </AlertDialogDescription>
        <DialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={false}
            onClick={() => {
              DeleteAchievementMutation.mutate({ id: achievement.id });
            }}
          >
            Удалить
          </AlertDialogAction>
        </DialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
