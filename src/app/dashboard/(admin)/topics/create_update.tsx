"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
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
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {topic ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Редактировать
          </DropdownMenuItem>
        ) : (
          <Button>Создать</Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{topic ? "Редактировать" : "Создать"} Тему</DialogTitle>
        </DialogHeader>

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

            <DialogFooter>
              <Button
                disabled={
                  updateTopicMutation.isPending || createTopicMutation.isPending
                }
                type="submit"
              >
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
