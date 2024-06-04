"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import { Form, FormField, FormItem, FormControl, FormDescription } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { useToast } from "~/components/ui/use-toast";
import { type Building, type Topic, TopicsInputShema } from "~/lib/shared/types";
import { api } from "~/trpc/react";
import { OnError } from "~/lib/shared/onError";
import { string, type z } from "zod";


export default function CreateUpdateTopics({
    topics, 
    building
    } : {
        topics? : Topic;
        building : Building[];
    }) {
        const [open, setOpen] = useState(false);

        const form = useForm({
            resolver: zodResolver(TopicsInputShema),
            defaultValues: {
                nameTopics: topics?.nameTopics ?? "",
            }
        });

        const router = useRouter();
        const {toast} = useToast();

        const createTopicMutation = api.topics.create.useMutation({
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
        
        const updateTopicMutation = api.topics.update.useMutation({
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
        
        const onSubmit = (data: z.infer<typeof TopicsInputShema>) => {
            if (topics) {
              updateTopicMutation.mutate({id: topics.id, ...data})
            } else {
              createTopicMutation.mutate(data)
            }
        }

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {topics ? (
                        <DropdownMenuItem onSelect={e => e.preventDefault()}>Редактировать</DropdownMenuItem>
                    ) : (
                        <Button>Создать</Button>
                    )}
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {topics ? "Редактировать" : "Создать"} Тему
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit, OnError(toast))}>
                            <FormField
                                control={form.control}
                                name="nameTopics"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Добавить тему" {...field}/>
                                        </FormControl>

                                        <FormDescription>
                                            Название темы
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                              <Button disabled={updateTopicMutation.isPending || createTopicMutation.isPending} type="submit">
                                Сохранить
                              </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        )
}