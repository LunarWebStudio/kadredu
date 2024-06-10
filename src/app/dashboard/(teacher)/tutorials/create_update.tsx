"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Form, FormField, FormItem, FormControl, FormDescription } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { useToast } from "~/components/ui/use-toast";
import { type Tutorial, TutorialInputShema, type Topic, type Subject } from "~/lib/shared/types";
import { api } from "~/trpc/react";
import { OnError } from "~/lib/shared/onError";
import { type z } from "zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import Image from "next/image";
import S3Image from "~/components/s3Image";
import { Skeleton } from "~/components/ui/skeleton";
import { ImagesToBase64 } from "~/lib/shared/images";
import Link from "next/link";


export default function CreateUpdateTutorial({
  tutorial,
  topics,
  subjects
}: {
    tutorial?: Tutorial;
    topics?: Topic[];
    subjects: Subject[];
}) {

  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(TutorialInputShema),
    defaultValues: {
      name: tutorial?.name ?? "",
      image: "",
      text: tutorial?.text ?? "",
      authorId: tutorial?.authorId ?? "",
      price: tutorial?.price ?? "",
      topicId: tutorial?.topicId ?? "",
      timeRead: tutorial?.timeRead ?? "",
      subjectId: tutorial?.subjectId ?? "",
    }
  });

  const router = useRouter();
  const { toast } = useToast();

  const createTutorialMutation = api.tutorial.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Туториал создан",
      });
      router.refresh();
      setOpen(false);
      form.reset();
    },
    onError: (err) => {
      toast({
        title: "Ошибка создания туториала",
        description: err.message,
        variant: "destructive",
      });
    },
  })

  const updateTutorialMutation = api.tutorial.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Тема обновлена",
      });
      router.refresh();
      setOpen(false);
    },
    onError: (err) => {
      toast({
        title: "Ошибка обновления темы",
        description: err.message,
        variant: "destructive",
      });
    },
  })

  const onSubmit = (data: z.infer<typeof TutorialInputShema>) => {
    if (tutorial) {
      updateTutorialMutation.mutate({ id: tutorial.id, ...data })
    } else {
      createTutorialMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {tutorial ? (
          <DropdownMenuItem onSelect={e => e.preventDefault()}>Редактировать</DropdownMenuItem>
        ) : (
          <Button>Добавить</Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <div style={{display: "flex", justifyContent: "space-between"}}>
            Туториалы

            <Link href="">Назад</Link>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, OnError(toast))} className="space-y-6">
            <div className="main">
              <p className="text-muted-foreground" style={{textAlign: "center"}}>Добавить туториал</p>
              <FormField

                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>

                    {form.watch("image") ? (
                        <Image
                          src={form.watch("image")}
                          width={60}
                          height={60}
                          className="object-cover rounded-lg w-full aspect-[2/1]"
                          alt="Image"
                        />
                      ) : (
                        <>
                          {tutorial ? (
                            <S3Image
                              src={tutorial.image.storageId}
                              alt={tutorial.name}
                              width={500}
                              height={500}
                              className="object-cover rounded-lg w-full aspect-[2/1]" 
                            />
                          ) : (
                            <Skeleton className="rounded-lg w-full aspect-[2/1]"/>
                          )}
                        </>
                    )}
                    <FormControl>
                      <Input type="file" {...field}
                        value=""
                        max={5}
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => {
                          if (!e.target.files?.[0]) return;
                          ImagesToBase64([e.target.files[0]]).then(data => {
                            field.onChange(data[0]!);
                          }).catch(_ => {
                            toast({
                              title: "Ошибка загрузки изображения",
                              variant: "destructive",
                            });
                          });
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Изображение группы
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Название" {...field} />
                    </FormControl>

                    <FormDescription>
                      Название задания
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeRead"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Время чтения" {...field} />
                    </FormControl>

                    <FormDescription>
                      Время чтения
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Цена" {...field} />
                    </FormControl>

                    <FormDescription>
                      Цена (необязательно)
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topicId"
                render={({ field }) => (
                  <FormItem>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тему" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map(topic => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Выберите тему
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите предмет" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.name}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Выберите предмет(необязательно)
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Текст" {...field} />
                    </FormControl>

                    <FormDescription>
                      Текст
                    </FormDescription>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button disabled={updateTutorialMutation.isPending || createTutorialMutation.isPending} style={{width: "100%"}} type="submit">
                  Сохранить
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
