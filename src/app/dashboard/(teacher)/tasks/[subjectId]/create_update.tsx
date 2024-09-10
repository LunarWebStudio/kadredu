"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import EditorText from "~/components/Editor";
import { DatePicker } from "~/components/date_picker";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { OnError } from "~/lib/shared/onError";
import { TaskInputShema } from "~/lib/shared/types/task";
import { api } from "~/trpc/react";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import Combobox from "~/components/ui/combobox";

export default function CreateUpdateTask({
  task_id,
}: {
  task_id?: string;
}) {
  const { data: task, isLoading: isTaskLoading } = api.task.getOne.useQuery(
    {
      id: task_id ?? "",
    },
    {
      enabled: !!task_id,
    },
  );

  const { data: tutorials, isLoading: isTutorialsLoading } =
    api.tutorial.getAllNames.useQuery();
  const { data: subjects, isLoading: isSubjectsLoading } =
    api.subject.getAssigned.useQuery();

  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(TaskInputShema),
    defaultValues: (task ??
      ({
        groupIds: [],
      } as unknown)) as z.infer<typeof TaskInputShema>,
  });

  const groups = useMemo(
    () => subjects?.flatMap((s) => s.building.groups) ?? [],
    [subjects],
  );
  const selectedSubject = useMemo(
    () => subjects?.find((subject) => subject.id === form.watch("subjectId")),
    [subjects, form.watch("subjectId")],
  );
  const selectedGroups = useMemo(
    () => groups.filter((group) => form.watch("groupIds").includes(group.id)),
    [groups, form.watch("groupIds")],
  );
  const selectedTutorial = useMemo(
    () =>
      tutorials?.find((tutorial) => tutorial.id === form.watch("tutorialId")),
    [tutorials, form.watch("tutorialId")],
  );

  const router = useRouter();

  const createTaskMutation = api.task.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      form.reset();
      router.refresh();
    },
    onError: (err) => {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });

  const updateTaskMutation = api.task.update.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
    onError: (err) => {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof TaskInputShema>) => {
    if (task) {
      updateTaskMutation.mutate({ id: task.id, ...data });
      return;
    }
    createTaskMutation.mutate(data);
  };

  const [hasDeadline, setHasDeadline] = useState(true);
  useEffect(() => {
    if (!hasDeadline) {
      form.setValue("deadline", null);
    }
  }, [hasDeadline]);

  useEffect(() => {
    if (task) {
      form.reset(task as z.infer<typeof TaskInputShema>);
      setHasDeadline(!!task.deadline);
    }
  }, [task]);

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger>
        {task_id ? (
          <DropdownMenuItem
            loading={isTaskLoading}
            onSelect={(e) => e.preventDefault()}
          >
            Редактировать
          </DropdownMenuItem>
        ) : (
          <Button loading={isTaskLoading}>Создать</Button>
        )}
      </SheetTrigger>
      <SheetContent className="md:max-w-screen 2xl:w-3/4 md:w-screen w-screen">
        <SheetHeader>
          <SheetTitle>
            {task ? "Редактирование задания" : "Добавить задание"}
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, OnError)}
            className="space-y-6 grid grid-cols-1 xl:grid-cols-2"
          >
            <div className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Название задания"
                        {...field}
                      />
                    </FormControl>

                    <FormDescription className="pb-2">
                      Название задания
                    </FormDescription>
                  </FormItem>
                )}
              />

              <div className="flex flex-row gap-2">
                <Checkbox
                  checked={hasDeadline}
                  onCheckedChange={(val) => setHasDeadline(!!val)}
                />
                <FormDescription>Дедлайн</FormDescription>
              </div>

              {hasDeadline && (
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <DatePicker
                          date={field.value ?? undefined}
                          setDate={field.onChange}
                          mode="single"
                          disabled={{
                            before: new Date(),
                          }}
                        />
                      </FormControl>
                      <FormDescription className="pb-2">
                        Есть дедлайн
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="coins"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Монеты"
                          {...field}
                        />
                      </FormControl>

                      <FormDescription className="pb-2">Монеты</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Опыт"
                          {...field}
                        />
                      </FormControl>

                      <FormDescription className="pb-2">Опыт</FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="groupIds"
                render={({ field }) => (
                  <FormItem>
                    <Combobox
                      values={groups}
                      value={null}
                      placeholder={{
                        default: "Выберите группы",
                        empty: "Группы не найдены",
                      }}
                      onChange={(v) => {
                        if (!v) return;

                        if (field.value.includes(v?.id)) {
                          field.onChange(
                            field.value.filter((g) => g !== v?.id),
                          );
                          return;
                        }

                        field.onChange([...field.value, v?.id]);
                      }}
                    >
                      <Button
                        variant="secondary"
                        loading={isSubjectsLoading}
                        disabled={groups.length === 0}
                        className="w-full"
                        chevron
                      >
                        {selectedGroups.length !== 0
                          ? selectedGroups.map((g) => g.name).join(", ")
                          : "Выберите группы"}
                      </Button>
                    </Combobox>
                    <FormDescription className="pb-2">Группа</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tutorialId"
                render={({ field }) => (
                  <FormItem>
                    <Combobox
                      values={tutorials ?? []}
                      value={null}
                      placeholder={{
                        default: "Выберите туториал",
                        empty: "Туториалы не найдены",
                      }}
                      onChange={(v) => field.onChange(v?.id)}
                    >
                      <Button
                        variant="secondary"
                        loading={isTutorialsLoading}
                        disabled={tutorials?.length === 0}
                        className="w-full"
                        chevron
                      >
                        {selectedTutorial?.name ?? "Выберите туториал"}
                      </Button>
                    </Combobox>
                    <FormDescription className="pb-2">Туториал</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <Combobox
                      values={subjects ?? []}
                      value={null}
                      placeholder={{
                        default: "Выберите предмет",
                        empty: "Предметы не найдены",
                      }}
                      onChange={(v) => {
                        if (!v) return;
                        field.onChange(v?.id);
                      }}
                    >
                      <Button
                        variant="secondary"
                        loading={isSubjectsLoading}
                        disabled={subjects?.length === 0}
                        className="w-full"
                        chevron
                      >
                        {selectedSubject?.name ?? "Выберите предмет"}
                      </Button>
                    </Combobox>
                    <FormDescription className="pb-2">
                      Выберите предмет
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Button
                loading={
                  updateTaskMutation.isPending || createTaskMutation.isPending
                }
                className="w-full"
                type="submit"
              >
                {task ? "Сохранить" : "Добавить"}
              </Button>
            </div>

            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="px-6">
                    <EditorText
                      text={field.value}
                      setText={field.onChange}
                      options={{
                        links: true,
                        code: true,
                        quotes: true,
                        images: true,
                      }}
                    />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
