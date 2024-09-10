"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommandList } from "cmdk";
import { Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import Combobox from "~/components/ui/combobox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { OnError } from "~/lib/shared/onError";
import { type Subject, SubjectSchema } from "~/lib/shared/types/subject";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function CreateUpdateSubject({
  subject,
}: {
  subject?: Subject;
}) {
  const [teachers] = api.user.getAll.useSuspenseQuery({
    role: "TEACHER",
  });
  const [buildings] = api.building.getAll.useSuspenseQuery();

  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(SubjectSchema),
    defaultValues: subject as z.infer<typeof SubjectSchema>,
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedBuilding = useMemo(() => {
    return buildings.find((b) => b.id === form.watch("buildingId")) ?? null;
  }, [buildings, form.watch("buildingId")]);

  const selectedTeacher = useMemo(() => {
    return teachers.find((t) => t.id === form.watch("teacherId")) ?? null;
  }, [teachers, form.watch("teacherId")]);

  const createSubjectMutation = api.subject.create.useMutation({
    onSuccess: () => {
      form.reset();
      router.refresh();
      setDialogOpen(false);
    },
    onError: (err) => {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });
  const updateSubjectMutation = api.subject.update.useMutation({
    onSuccess: () => {
      router.refresh();
      setDialogOpen(false);
    },
    onError: (err) => {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof SubjectSchema>) => {
    if (subject) {
      updateSubjectMutation.mutate({
        ...data,
        id: subject.id,
      });
      return;
    }
    createSubjectMutation.mutate(data);
  };
  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    >
      <DialogTrigger asChild>
        {subject ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Редактировать
          </DropdownMenuItem>
        ) : (
          <Button>Создать</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {subject ? "Редактировать предмет" : "Создать предмет"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className=" space-y-6"
            onSubmit={form.handleSubmit(onSubmit, OnError)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Название предмета</FormDescription>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Математика"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Преподаватель</FormDescription>
                  <Combobox
                    values={teachers
                      .filter((t) => t.name !== null)
                      .map((t) => ({
                        id: t.id,
                        name: t.name!,
                      }))}
                    // @ts-ignore
                    value={selectedTeacher}
                    onChange={(v) => field.onChange(v?.id)}
                    placeholder={{
                      default: "Выберите преподавателя",
                      empty: "Преподавателей не найдено",
                    }}
                  >
                    <Button
                      variant="ghost"
                      type="button"
                    >
                      {selectedTeacher?.name ?? "Преподаватель"}
                    </Button>
                  </Combobox>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buildingId"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>СП</FormDescription>
                  <Combobox
                    values={buildings}
                    value={selectedBuilding}
                    onChange={(v) => field.onChange(v?.id)}
                    placeholder={{
                      default: "Выберите СП",
                      empty: "СП не найдено",
                    }}
                  >
                    <Button
                      variant="ghost"
                      type="button"
                    >
                      {selectedBuilding?.name ?? "СП"}
                    </Button>
                  </Combobox>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                className=" ml-auto"
                disabled={
                  updateSubjectMutation.isPending ||
                  createSubjectMutation.isPending
                }
              >
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
