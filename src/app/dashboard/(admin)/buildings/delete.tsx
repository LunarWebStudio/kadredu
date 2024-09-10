"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import type { Building } from "~/lib/shared/types/building";
import { api } from "~/trpc/react";

export default function DeleteBuilding({ building }: { building: Building }) {
  const router = useRouter();

  const deleteBuildingMutation = api.building.delete.useMutation({
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
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Удалить
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удаление СП</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Вы уверены что хотите удалить "{building.title}" по адресу "
          {building.address}"?
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
