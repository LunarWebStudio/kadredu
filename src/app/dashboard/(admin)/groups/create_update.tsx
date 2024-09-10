"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Skeleton } from "~/components/ui/skeleton";
import { OnError } from "~/lib/shared/onError";
import type { Building } from "~/lib/shared/types/building";
import { type Group, GroupSchema } from "~/lib/shared/types/group";
import { api } from "~/trpc/react";

export default function CreateUpdateGroup({
  group,
}: {
  group?: Group;
}) {
  const [buildings] = api.building.getAll.useSuspenseQuery();

  const [open, setOpen] = useState(false);
  const formSchema = GroupSchema.superRefine((data, ctx) => {
    if (!data.image?.id && !data.image?.b64) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Необходимо загрузить изображение",
        path: ["image"],
      });
    }
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: group as z.infer<typeof formSchema>,
  });

  const router = useRouter();
  const createGroupMutation = api.group.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setOpen(false);
      form.reset();
    },
    onError: (err) => {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });

  const updateGroupMutation = api.group.update.useMutation({
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

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (group) {
      updateGroupMutation.mutate({ id: group.id, ...data });
      return;
    }
    createGroupMutation.mutate(data);
  };

  const [selectedBuilding, setSelectedBuilding] = useState<
    Building | undefined
  >(undefined);

  useEffect(() => {
    setSelectedBuilding(
      buildings.find((b) => b.id === form.watch("buildingId")),
    );
  }, [form.watch("buildingId")]);

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        {group ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Редактировать
          </DropdownMenuItem>
        ) : (
          <Button>Создать</Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{group ? "Редактировать" : "Создать"} Группу</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, OnError)}
            className="space-y-6"
          >
            <div className="border rounded-xl p-6 space-y-6">
              <p className="text-muted-foreground">Группа</p>
              <div className="flex flex-row gap-4 items-center text-base lg:text-lg text-nowrap">
                {form.watch("image.b64") ? (
                  <img
                    src={form.watch("image.b64")}
                    width={60}
                    height={60}
                    className="object-contain size-14"
                    alt="Image"
                  />
                ) : (
                  <>
                    {group ? (
                      <Image
                        src={group.image.id}
                        alt={group.name}
                        width={500}
                        height={500}
                        className="size-14 object-contain"
                      />
                    ) : (
                      <Skeleton className="size-14 rounded-md" />
                    )}
                  </>
                )}
                <div className="font-bold gap-1 flex flex-row">
                  <p>
                    {buildings.find(
                      (building) => building.id === form.watch("buildingId"),
                    )?.name ?? "Не выбрано"}
                  </p>
                  / {form.watch("name") ?? "Не указано"}
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Изображение группы</FormDescription>
                  <FormControl>
                    <Input
                      type="file"
                      {...field}
                      value=""
                      max={5}
                      accept="image/png, image/jpeg, image/webp"
                      onUpload={(files) => {
                        if (!files?.[0]) return;
                        field.onChange(files[0]);
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
                  <FormDescription>Выберите СП</FormDescription>
                  <Combobox
                    values={buildings}
                    value={selectedBuilding ?? null}
                    onChange={(v) => field.onChange(v?.id)}
                    placeholder={{
                      default: "Выберите СП",
                      empty: "СП не найдено",
                    }}
                  >
                    <Button
                      variant="secondary"
                      className="w-full"
                      chevron
                    >
                      {selectedBuilding?.name ?? "Выберите СП"}
                    </Button>
                  </Combobox>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Название группы</FormDescription>
                  <FormControl>
                    <Input
                      placeholder="ИС-10"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <SheetFooter>
              <Button
                className="w-full"
                disabled={
                  updateGroupMutation.isPending || createGroupMutation.isPending
                }
                type="submit"
              >
                Сохранить
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
