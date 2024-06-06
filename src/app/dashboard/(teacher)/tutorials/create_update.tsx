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
import { type Tutorial, TutorialInputShema, Topic } from "~/lib/shared/types";
import { api } from "~/trpc/react";
import { OnError } from "~/lib/shared/onError";
import { type z } from "zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";


export default function CreateUpdateTutorial({
  tutorial,
  topics
}: {
    tutorial?: Tutorial;
    topics?: Topic[];
}) {

  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(TutorialInputShema),
    defaultValues: {
      name: tutorial?.name ?? "",
      image: tutorial?.image ?? "",
      text: tutorial?.text ?? "",
      authorId: tutorial?.authorId ?? "",
      price: tutorial?.price ?? "",
      topic: tutorial?.topic ?? "",
      timeRead: tutorial?.timeRead ?? ""
    }
  });

  const router = useRouter();
  const { toast } = useToast();

  const createTutorialMutation = api.tutorial.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Тема создана",
      });
      router.refresh();
      setOpen(false);
      form.reset();
    },
    onError: (err) => {
      toast({
        title: "Ошибка создания темы",
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
        <DialogHeader>
          <DialogTitle>
            {tutorial ? "Редактировать" : "Создать"} Туториал
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, OnError(toast))} className="space-y-6">
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
              name="topic"
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

            <DialogFooter>
              <Button disabled={updateTutorialMutation.isPending || createTutorialMutation.isPending} type="submit">
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
