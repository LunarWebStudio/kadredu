"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import DashboardTemplate from "~/app/dashboard/templ";
import EditorText from "~/components/Editor";
import BackButton from "~/components/backButton";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/components/ui/use-toast";
import { OnError } from "~/lib/shared/onError";
import {
  type Group,
  type Subject,
  type Task,
  TaskInputShema,
  type Tutorial,
} from "~/lib/shared/types";
import { api } from "~/trpc/react";

export default function CreateUpdateTask({
  task,
  tutorials,
  subjects,
  groups,
}: {
  task?: Task;
  tutorials: Tutorial[];
  subjects: Subject[];
  groups: Group[];
}) {
  const form = useForm({
    resolver: zodResolver(TaskInputShema),
    defaultValues: {
      name: task?.name ?? "",
      deadline: task?.deadline as Date | null,
      description: task?.description ?? "",
      experience: task?.experience ?? 0,
      coin: task?.coin ?? 0,
      tutorialId: task?.tutorialId ?? "",
      subjectId: task?.subjectId ?? "",
      groupId: task?.groupId ?? "",
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const [hasDeadline, setHasDeadline] = useState(true);
  useEffect(() => {
    if (!hasDeadline) {
      form.setValue("deadline", null);
    }
  }, [hasDeadline]);

  const createTaskMutation = api.task.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Задание создано",
      });
      form.reset();
      router.push("/dashboard/tasks");
      router.refresh();
    },
    onError: (err) => {
      toast({
        title: "Ошибка создания задания",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const updateTasklMutation = api.task.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Задание обновлено",
      });
      router.refresh();
      router.push("/dashboard/tasks");
    },
    onError: (err) => {
      toast({
        title: "Ошибка обновления задания",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof TaskInputShema>) => {
    if (task) {
      updateTasklMutation.mutate({ id: task.id, ...data });
    } else {
      createTaskMutation.mutate(data);
    }
  };

  return (
    <DashboardTemplate
      navbar={
        <Link href="/dashboard/tasks">
          <BackButton />
        </Link>
      }
      title="Задания"
    >
      <div className="max-h-full grow overflow-y-scroll">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, OnError(toast))}
            className="space-y-6 grid grid-cols-2"
          >
            <div className="p-6 space-y-6">
              {task ? (
                <p className="text-muted-foreground text-center text-2xl pb-4">
                  Редактирование задания
                </p>
              ) : (
                <p className="text-muted-foreground text-center text-2xl pb-4">
                  Добавить задание
                </p>
              )}

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
                  name="coin"
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
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Группа" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem
                            key={group.id}
                            value={group.id}
                          >
                            {group.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="pb-2">Группа</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tutorialId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Туториал" />
                      </SelectTrigger>
                      <SelectContent>
                        {tutorials.map((tutorial) => (
                          <SelectItem
                            key={tutorial.id}
                            value={tutorial.id}
                          >
                            {tutorial.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="pb-2">Туториал</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Предмет" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem
                            key={subject.id}
                            value={subject.id}
                          >
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="pb-2">
                      Выберите предмет
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Button
                disabled={
                  updateTasklMutation.isPending || createTaskMutation.isPending
                }
                style={{ width: "100%" }}
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
                      options={{ links: true, code: true, quotes: true }}
                    />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </DashboardTemplate>
  );
}
