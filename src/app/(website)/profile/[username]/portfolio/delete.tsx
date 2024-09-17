"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { PortfolioProject } from "~/lib/shared/types/portfolio";
import { api } from "~/trpc/react";

export default function DeleteProject({
  project,
}: {
  project: PortfolioProject;
}) {
  const router = useRouter();
  const deleteProjectMutation = api.portfolio.delete.useMutation({
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
    onError: (err) => {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="text-red-600" variant="ghost">
          Удалить
        </Button>
      </SheetTrigger>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Удалить проект</SheetTitle>
        </SheetHeader>
        <p>
          Вы уверены, что хотите удалить проект из своего портфолио навсегда?
          Это действие нельзя будет отменить.
        </p>
        <SheetFooter>
          <Button
            className="w-full"
            disabled={deleteProjectMutation.isPending}
            onClick={() => deleteProjectMutation.mutate({ id: project.id })}
          >
            Удалить
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
