"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import EditorText from "~/components/Editor";
import { Button } from "~/components/ui/button";
import Combobox from "~/components/ui/combobox";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "~/components/ui/form";
import Image from "~/components/ui/image";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Skeleton } from "~/components/ui/skeleton";
import { OnError } from "~/lib/shared/onError";
import { OneTutorial, TutorialInputShema } from "~/lib/shared/types/tutorial";
import { api } from "~/trpc/react";

export default function CreateUpdateTutorial({
  tutorial,
}: {
  tutorial?: OneTutorial;
}) {
  const [open, setOpen] = useState(false);
  const [topics] = api.topic.getAll.useSuspenseQuery();
  const [subjects] = api.subject.getAll.useSuspenseQuery();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(TutorialInputShema),
    defaultValues: tutorial as unknown as z.infer<typeof TutorialInputShema>,
  });

  const createTutorialMutation = api.tutorial.create.useMutation({
    onSuccess: () => {
      form.reset();
      router.refresh();
      setOpen(false);
    },
    onError: (err) => {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });

  const updateTutorialMutation = api.tutorial.update.useMutation({
    onSuccess: () => {
      router.refresh();
      setOpen(false);
    },
    onError: (err) => {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof TutorialInputShema>) => {
    if (tutorial) {
      updateTutorialMutation.mutate({ id: tutorial.id, ...data });
      return;
    }
    createTutorialMutation.mutate(data);
  };

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === form.watch("topicId")),
    [topics, form.watch("topicId")],
  );
  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.id === form.watch("subjectId")),
    [subjects, form.watch("subjectId")],
  );

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger>
        {tutorial ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Редактировать
          </DropdownMenuItem>
        ) : (
          <Button>Создать</Button>
        )}
      </SheetTrigger>
      <SheetContent className="md:max-w-screen 2xl:w-3/4 md:w-screen w-screen">
        <SheetHeader>
          <SheetTitle>
            {tutorial ? " Редактирование туториала" : "Добавить туториал"}
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
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <div className="rounded-lg w-full aspect-[2/1] overflow-hidden">
                      {field.value?.b64 ? (
                        <img
                          src={field.value.b64}
                          className="object-cover size-full"
                          alt="Image"
                        />
                      ) : (
                        <>
                          {tutorial ? (
                            <Image
                              src={tutorial.image.id}
                              alt={tutorial.name}
                              width={2000}
                              height={1000}
                              className="size-full object-cover"
                            />
                          ) : (
                            <Skeleton className="size-full" />
                          )}
                        </>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        type="file"
                        {...field}
                        value=""
                        max={5}
                        accept="image/png, image/jpeg, image/webp"
                        onUpload={(v) => {
                          if (!v[0]) return;

                          field.onChange(v[0]);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Название"
                        {...field}
                      />
                    </FormControl>

                    <FormDescription className="pb-2">Название</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeRead"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Время чтения"
                        {...field}
                      />
                    </FormControl>

                    <FormDescription className="pb-2">
                      Время чтения
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topicId"
                render={({ field }) => (
                  <FormItem>
                    <Combobox
                      values={topics}
                      value={selectedTopic ?? null}
                      placeholder={{
                        default: "Выберите тему",
                        empty: "Тем не найдено",
                      }}
                      onChange={(v) => field.onChange(v?.id)}
                    >
                      <Button
                        className="w-full"
                        variant="secondary"
                        chevron
                      >
                        {selectedTopic?.name ?? "Выберите тему"}
                      </Button>
                    </Combobox>
                    <FormDescription>Выберите тему</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <Combobox
                      values={subjects}
                      value={selectedSubject ?? null}
                      placeholder={{
                        default: "Выберите предмет",
                        empty: "Предмет не найден",
                      }}
                      onChange={(v) => {
                        console.log(v);
                        field.onChange(v?.id);
                      }}
                    >
                      <Button
                        className="w-full"
                        variant="secondary"
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
                  updateTutorialMutation.isPending ||
                  createTutorialMutation.isPending
                }
                className="w-full"
                type="submit"
              >
                {tutorial ? "Сохранить" : "Добавить"}
              </Button>
            </div>

            <div>
              <FormField
                control={form.control}
                name="content"
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
