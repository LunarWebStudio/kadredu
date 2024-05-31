"use client";

import { useRouter } from "next/navigation";
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
import type { Building } from "~/lib/shared/types";
import { api } from "~/trpc/react";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";

export default function DeleteBuilding({ building }: { building: Building }) {
  const router = useRouter();
  const { toast } = useToast();

  const deleteBuildingMutation = api.building.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Успешно",
        description: "Здание было удалено"
      });
    },
    onError: err => {
      toast({
        title: "Ошибка",
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
          <AlertDialogTitle>Удаление здания</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Вы уверены что хотите удалить "{building.title}" по адресу "
          {building.address}"
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteBuildingMutation.isPending}
            onClick={() => deleteBuildingMutation.mutate({ id: building.id })}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
