"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import Combobox from "~/components/ui/combobox";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { OnError } from "~/lib/shared/onError";
import { AchievementInputSchema, GrantAchievementSchema } from "~/lib/shared/types/achievements";
import { api } from "~/trpc/react";

export default function GrantAchievement({
  userId,
}: {
  userId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [achievements] = api.achievements.getAll.useSuspenseQuery()


  const form = useForm({
    resolver: zodResolver(AchievementInputSchema),
    defaultValues:{
      achievementId: undefined
    }
  });

  const selectedAchievement = useMemo(
    () => achievements.find(el => el.id === form.watch("achievementId")),
    [achievements, form.watch("achievementId")]
  )

  const grantAchievementMutation = api.user.grantAchievement.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      form.reset();
      toast.success("Достижение выдано");
    },
    onError: (err) => {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof AchievementInputSchema>) => {
    grantAchievementMutation.mutate({ id: userId, achievementId: data.achievementId });
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      modal={true}
    >
      <PopoverTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Выдать награду
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
              name="achievementId"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Награда</FormDescription>
                  <Combobox
                    values={
                      achievements.map(el => ({
                        id:el.id,
                        name:el.name
                      }))
                    }
                    value={
                      field.value
                        ?
                          {
                            id: field.value as string,
                            name:selectedAchievement?.name ?? "Награда..."
                          }
                          :
                        null
                    }
                    placeholder={{
                      empty: "Выберите награду",
                      default: "Награда...",
                    }}
                    onChange={(t) => field.onChange(t?.id)}
                  >
                    <Button className="w-full" variant="outline" chevron>
                      {selectedAchievement?.name ?? "Выберите награду..."}
                    </Button>
                  </Combobox>


                </FormItem>
              )}

              />
            <Button
              disabled={grantAchievementMutation.isPending}
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
