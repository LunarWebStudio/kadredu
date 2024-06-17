"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { OnError } from "~/lib/shared/onError";
import { type Building, BuildingInputSchema } from "~/lib/shared/types";
import { api } from "~/trpc/react";

export default function CreateUpdateBuilding({ building }: { building?: Building }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(BuildingInputSchema),
    defaultValues: {
      title: building?.title ?? "",
      address: building?.address ?? ""
    }
  });

  const createBuildingMutation = api.building.create.useMutation({
    onSuccess: () => {
      form.reset();
      router.refresh();
      setOpen(false);
    },
    onError: (err) => {
      toast({
        title: "Ошибка",
        description: err.message,
        variant: "destructive"
      })
    }
  })

  const updateBuildingMutation = api.building.update.useMutation({
    onSuccess: () => {
      router.refresh();
      setOpen(false);
    },
    onError: (err) => {
      toast({
        title: "Ошибка",
        description: err.message,
        variant: "destructive"
      })
    }
  })

  const onSubmit = (data: z.infer<typeof BuildingInputSchema>) => {
    if (building) {
      updateBuildingMutation.mutate({ ...data, id: building.id })
    } else {
      createBuildingMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {building ? (
          <DropdownMenuItem onSelect={e => e.preventDefault()}>Редактировать</DropdownMenuItem>
        ) : (
          <Button>Создать</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {building ? "Редактировать" : "Создать"} СП
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, OnError(toast))} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>
                    Название СП
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="СП-10" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>
                    Адрес
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="г. Москва, ул. Ленина, д. 10" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                disabled={createBuildingMutation.isPending || updateBuildingMutation.isPending}
                type="submit">Сохранить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
