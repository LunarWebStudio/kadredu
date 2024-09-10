"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { OnError } from "~/lib/shared/onError";
import { type Topic, TopicSchema } from "~/lib/shared/types/topic";
import { api } from "~/trpc/react";

export default function CreateUpdateTopic({
  topic,
}: {
  topic?: Topic;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(TopicSchema),
    defaultValues: topic as z.infer<typeof TopicSchema>,
  });

  const router = useRouter();

  const createTopicMutation = api.topic.create.useMutation({
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

  const updateTopicMutation = api.topic.update.useMutation({
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

  const onSubmit = (data: z.infer<typeof TopicSchema>) => {
    if (topic) {
      updateTopicMutation.mutate({ id: topic.id, ...data });
      return;
    }
    createTopicMutation.mutate(data);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        {topic ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Редактировать
          </DropdownMenuItem>
        ) : (
          <Button>Создать</Button>
        )}
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>{topic ? "Редактировать" : "Создать"} Тему</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, OnError)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Название темы</FormDescription>
                  <FormControl>
                    <Input
                      placeholder="Добавить тему"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <SheetFooter>
              <Button
                disabled={
                  updateTopicMutation.isPending || createTopicMutation.isPending
                }
                type="submit"
                className="w-full"
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
