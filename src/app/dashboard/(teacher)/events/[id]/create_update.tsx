"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl, FormDescription } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { type Event, EventInputShema, type TypeEvent, type Group } from "~/lib/shared/types";
import { api } from "~/trpc/react";
import { OnError } from "~/lib/shared/onError";
import { type z } from "zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import Image from "next/image";
import S3Image from "~/components/s3Image";
import { Skeleton } from "~/components/ui/skeleton";
import { ImagesToBase64 } from "~/lib/shared/images";
import Link from "next/link";
import EditorText from "~/components/Editor";
import DashboardTemplate from "~/app/dashboard/templ";
import BackButton from "~/components/backButton";
import { DatePicker } from "~/components/date_picker";

export default function CreateUpdateEvent({
  event,
  types,
  groups
}: {
    event?: Event;
    types?: TypeEvent[];
    groups?: Group[];
}) {

  const form = useForm({
    resolver: zodResolver(EventInputShema),
    defaultValues: {
      name: event?.name ?? "",
      description: event?.description ?? "",
      imageId: event?.imageId ?? "",
      dateStart: event?.dateStart as Date | null,
      dateEnd: event?.dateEnd as Date | null,
      typeId: event?.typeId ?? "",
      groupId: event?.groupId ?? "",
      address: event?.address ?? "",
    }
  });

  const router = useRouter();
  const { toast } = useToast();

  const createEventMutation = api.event.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Мероприятие создано",
      });
      form.reset();
      router.push("/dashboard/events");
      router.refresh();
    },
    onError: (err) => {
      toast({
        title: "Ошибка создания мероприятия",
        description: err.message,
        variant: "destructive",
      });
    },
  })

  const updateEventMutation = api.event.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Мероприятие обновлено",
      });
      router.refresh();
      router.push("/dashboard/events");
    },
    onError: (err) => {
      toast({
        title: "Ошибка обновления мероприятия",
        description: err.message,
        variant: "destructive",
      });
    },
  })

  const onSubmit = (data: z.infer<typeof EventInputShema>) => {
    if (event) {
        updateEventMutation.mutate({ id: event.id, ...data })
    } else {
        createEventMutation.mutate(data)
    }
  }

  return (

      <DashboardTemplate
            navbar={
                <Link href="/dashboard/events">
                  <BackButton/>
                </Link>
            }
            title="Мероприятия"
      >
        <div className="max-h-full grow overflow-y-scroll">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, OnError(toast))} className="space-y-6 grid grid-cols-2">
              <div className="p-6 space-y-6">
                {event ? (
                  <p className="text-muted-foreground text-center text-2xl pb-4">Редактирование мероприятия</p>
                ) : (
                  <p className="text-muted-foreground text-center text-2xl pb-4">Добавить мероприятие</p>
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
                            {event ? (
                              <S3Image
                                src={event.image.storageId}
                                alt={event.name}
                                width={300}
                                height={300}
                                className="object-cover rounded-lg w-full aspect-[2/1]" 
                              />
                            ) : (
                              <Skeleton className="rounded-lg w-full aspect-[3/1]"/>
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
                        Название мероприятия
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="dateStart"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <DatePicker
                                        date={field.value ?? undefined}
                                        setDate={field.onChange}
                                        mode="single"
                                        disabled={{
                                            before: new Date()
                                        }}
                                    />
                                </FormControl>

                                <FormDescription className="pb-2">
                                    Дата начала
                                </FormDescription>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dateEnd"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <DatePicker
                                        date={field.value ?? undefined}
                                        setDate={field.onChange}
                                        mode="single"
                                        disabled={{
                                            before: new Date()
                                        }}
                                    />
                                </FormControl>

                                <FormDescription className="pb-2">
                                    Дата конца
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                  control={form.control}
                  name="typeId"
                  render={({ field }) => (
                    <FormItem>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                          {types?.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="pb-2">
                        Выберите тип
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="groupId"
                  render={({ field }) => (
                    <FormItem>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите группу" />
                        </SelectTrigger>
                        <SelectContent>
                          {groups?.map(group => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="pb-2">
                        Выберите тип
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Адрес" {...field} />
                      </FormControl>

                      <FormDescription className="pb-2">
                        Адрес
                      </FormDescription>
                    </FormItem>
                  )}
                />


                <Button disabled={updateEventMutation.isPending || createEventMutation.isPending} style={{width: "100%"}} type="submit">
                  {event ? (
                    "Сохранить"
                  ) : (
                    "Добавить"
                  )}
                </Button>

              </div>

              <div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <EditorText text={field.value} setText={field.onChange} options={{links: true, code: true, quotes: true}}/>
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
