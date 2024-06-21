"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { useToast } from "~/components/ui/use-toast";
import { OnError } from "~/lib/shared/onError";
import { ExperienceInputSchema } from "~/lib/shared/types";
import { api } from "~/trpc/react";

export default function GrantExperience({
  userId
}: {
  userId: string;
}) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(ExperienceInputSchema),
    defaultValues: {
      experience: 0
    }
  })

  const grantExperienceMutation = api.user.grantExperience.useMutation({
    onSuccess: () => {
      toast({
        title: "Опыт успешно выдан",
      });
      setIsOpen(false);
      form.reset();
    },
    onError: (err) => {
      toast({
        title: "Ошибка ошибка выдачи опыта",
        description: err.message,
        variant: "destructive",
      });
    },
  })

  const onSubmit = (data: z.infer<typeof ExperienceInputSchema>) => {
    grantExperienceMutation.mutate({ id: userId, experience: data.experience })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <DropdownMenuItem onSelect={e => e.preventDefault()}>
          Выдать опыт
        </DropdownMenuItem>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, OnError(toast))} className="space-y-6">
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Количество опыта</FormDescription>
                  <FormControl>
                    <Input placeholder="1000" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button disabled={grantExperienceMutation.isPending} type="submit">
              Выдать
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
