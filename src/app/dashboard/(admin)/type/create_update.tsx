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
import { EventTypeInputShema, type EventType } from "~/lib/shared/types";
import { api } from "~/trpc/react";
import { OnError } from "~/lib/shared/onError";
import { type z } from "zod";


export default function CreateUpdateEventType({
  type,
}: {
  type?: EventType;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(EventTypeInputShema),
    defaultValues: {
      name: type?.name ?? "",
    }
  });

  const router = useRouter();
  const { toast } = useToast();

  const createTypeMutation = api.eventType.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Тип мероприятия создан",
      });
      router.refresh();
      setOpen(false);
      form.reset();
    },
    onError: (err) => {
      toast({
        title: "Ошибка создания типа мероприятия",
        description: err.message,
        variant: "destructive",
      });
    },
  })

  const updateTypeMutation = api.eventType.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Тип мероприятия обновлен",
      });
      router.refresh();
      setOpen(false);
    },
    onError: (err) => {
      toast({
        title: "Ошибка обновления типа мероприятия",
        description: err.message,
        variant: "destructive",
      });
    },
  })

  const onSubmit = (data: z.infer<typeof EventTypeInputShema>) => {
    if (type) {
      updateTypeMutation.mutate({ id: type.id, ...data })
    } else {
      createTypeMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type ? (
          <DropdownMenuItem onSelect={e => e.preventDefault()}>Редактировать</DropdownMenuItem>
        ) : (
          <Button>Создать</Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type ? "Редактировать" : "Создать"} Мероприятие
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, OnError(toast))} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>
                    Тип мероприятия
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Тип мероприятия" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={updateTypeMutation.isPending || createTypeMutation.isPending} type="submit">
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
