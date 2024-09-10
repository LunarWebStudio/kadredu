"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { OnError } from "~/lib/shared/onError";
import { ExperienceInputSchema } from "~/lib/shared/types/utils";
import { api } from "~/trpc/react";

export default function GrantExperience({
  userId,
}: {
  userId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(ExperienceInputSchema),
    defaultValues: {
      experience: 0,
    },
  });

  const grantExperienceMutation = api.user.grantExperience.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      form.reset();
    },
    onError: (err) => {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof ExperienceInputSchema>) => {
    grantExperienceMutation.mutate({ id: userId, experience: data.experience });
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      modal={true}
    >
      <PopoverTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Выдать опыт
        </DropdownMenuItem>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, OnError)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Количество опыта</FormDescription>
                  <FormControl>
                    <Input
                      placeholder="1000"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              disabled={grantExperienceMutation.isPending}
              type="submit"
            >
              Выдать
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
