"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import S3Image from "~/components/s3Image";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { useToast } from "~/components/ui/use-toast";
import { ImagesToBase64 } from "~/lib/shared/images";
import { OnError } from "~/lib/shared/onError";
import { GroupInputSchema, type Building, type Group } from "~/lib/shared/types";
import { api } from "~/trpc/react";

export default function CreateUpdateGroup({
  group,
  buildings
}: {
  group?: Group;
  buildings: Building[];
}) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(GroupInputSchema),
    defaultValues: {
      title: group?.title ?? "",
      buildingId: group?.buildingId ?? "",
      image: "",
    }
  })

  const router = useRouter();
  const { toast } = useToast();
  const createGroupMutation = api.group.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Группа создана",
      });
      router.refresh();
      setOpen(false);
      form.reset();
    },
    onError: (err) => {
      toast({
        title: "Ошибка создания группы",
        description: err.message,
        variant: "destructive",
      });
    },
  })

  const updateGroupMutation = api.group.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Группа обновлена",
      });
      router.refresh();
      setOpen(false);
    },
    onError: (err) => {
      toast({
        title: "Ошибка обновления группы",
        description: err.message,
        variant: "destructive",
      });
    },
  })

  const onSubmit = (data: z.infer<typeof GroupInputSchema>) => {
    if (group) {
      updateGroupMutation.mutate({ id: group.id, ...data })
    } else {
      createGroupMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {group ? (
          <DropdownMenuItem onSelect={e => e.preventDefault()}>Редактировать</DropdownMenuItem>
        ) : (
          <Button>Создать</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {group ? "Редактировать" : "Создать"} Группу
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, OnError(toast))} className="space-y-6">
            <div className="border rounded-xl p-6 space-y-6">
              <p className="text-muted-foreground">Группа</p>
              <div className="flex flex-row gap-4 items-center">
                {form.watch("image") ? (
                  <Image
                    src={form.watch("image")}
                    width={60}
                    height={60}
                    className="object-contain size-14"
                    alt="Image"
                  />
                ) : (
                  <>
                    {group ? (
                      <S3Image
                        src={group.image.storageId}
                        alt={group.title}
                        width={500}
                        height={500}
                        className="size-14 object-contain"
                      />
                    ) : (
                      <Skeleton className="size-14 rounded-md" />
                    )}
                  </>
                )}
                <div className="text-lg font-bold gap-1 flex flex-row">
                  <p>{buildings.find(building => building.id === form.watch("buildingId"))?.title ?? "Не выбрано"}</p>
                  / {form.watch("title") === "" ? "Не указано" : form.watch("title")}
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>
                    Изображение группы
                  </FormDescription>
                  <FormControl>
                    <Input type="file" {...field}
                      value=""
                      max={5}
                      accept="image/png, image/jpeg, image/webp"
                      onChange={async (e) => {
                        if (!e.target.files?.[0]) return;
                        field.onChange((await ImagesToBase64([e.target.files[0]] as const))[0])
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buildingId"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>
                    Выберите СП
                  </FormDescription>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите СП" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map(building => (
                        <SelectItem key={building.id} value={building.id}>
                          {building.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>
                    Название группы
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="ИС-10" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                disabled={updateGroupMutation.isPending || createGroupMutation.isPending}
                type="submit">Сохранить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
