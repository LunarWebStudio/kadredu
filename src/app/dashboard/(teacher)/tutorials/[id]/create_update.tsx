"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import DashboardTemplate from "~/app/dashboard/templ";
import EditorText from "~/components/Editor";
import BackButton from "~/components/backButton";
import S3Image from "~/components/s3Image";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { useToast } from "~/components/ui/use-toast";
import { ImagesToBase64 } from "~/lib/shared/images";
import { OnError } from "~/lib/shared/onError";
import { OneTutorial, TutorialInputShema, type Subject, type Topic } from "~/lib/shared/types";
import { api } from "~/trpc/react";


export default function CreateUpdateTutorial({
  tutorial,
  topics,
  subjects
}: {
  tutorial?: OneTutorial;
  topics?: Topic[];
  subjects: Subject[];
}) {

  const form = useForm({
    resolver: zodResolver(TutorialInputShema),
    defaultValues: {
      name: tutorial?.name ?? "",
      imageId: tutorial?.imageId ?? "",
      text: tutorial?.text ?? "",
      authorId: tutorial?.authorId ?? "",
      price: tutorial?.price ?? 0,
      topicId: tutorial?.topicId ?? "",
      timeRead: tutorial?.timeRead ?? 0,
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
      form.reset();
      router.push("/dashboard/tutorials");
      router.refresh();
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
        title: "Туториал обновлен",
      });
      router.refresh();
      router.push("/dashboard/tutorials");
    },
    onError: (err) => {
      toast({
        title: "Ошибка обновления туториала",
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

    <DashboardTemplate
      navbar={
        <Link href="/dashboard/tutorials">
          <BackButton />
        </Link>
      }
      title="Туториалы"
    >
      <div className="max-h-full grow overflow-y-scroll">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, OnError(toast))} className="space-y-6 grid grid-cols-2">
            <div className="p-6 space-y-6">
              {tutorial ? (
                <p className="text-muted-foreground text-center text-2xl pb-4">Редактирование туториала</p>
              ) : (
                <p className="text-muted-foreground text-center text-2xl pb-4">Добавить туториал</p>
              )}
              <FormField

                control={form.control}
                name="imageId"
                render={({ field }) => (
                  <FormItem>

                    {form.watch("imageId") ? (
                      <Image
                        src={form.watch("imageId")}
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
                            width={300}
                            height={300}
                            className="object-cover rounded-lg w-full aspect-[2/1]"
                          />
                        ) : (
                          <Skeleton className="rounded-lg w-full aspect-[3/1]" />
                        )}
                      </>
                    )}
                    <FormControl>
                      <Input type="file" {...field}
                        value=""
                        max={5}
                        accept="image/png, image/jpeg, image/webp"
                        onChange={async (e) => {
                          if (!e.target.files?.[0]) return;
                          field.onChange((await ImagesToBase64([e.target.files[0]] as const))[0])
                        }}

                        className="pb-2 pt-2"
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
                      <Input placeholder="Название" {...field} />
                    </FormControl>

                    <FormDescription className="pb-2">
                      Название туториала
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

                    <FormDescription className="pb-2">
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

                    <FormDescription className="pb-2">
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
                        {topics?.map(topic => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="pb-2">
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
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="pb-2">
                      Выберите предмет(необязательно)
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Button disabled={updateTutorialMutation.isPending || createTutorialMutation.isPending} style={{ width: "100%" }} type="submit">
                {tutorial ? (
                  "Сохранить"
                ) : (
                  "Добавить"
                )}
              </Button>

            </div>

            <div>
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem className="px-6">
                    <EditorText text={field.value} setText={field.onChange} options={{ links: true, code: true, quotes: true }} />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </DashboardTemplate>
  )
}
