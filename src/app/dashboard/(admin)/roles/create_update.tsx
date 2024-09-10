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
import { RoleSchema } from "~/lib/shared/types/role";
import { api } from "~/trpc/react";

export default function CreateUpdateRole({
  role,
}: {
  role?: { id: string; name: string };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(RoleSchema),
    defaultValues: role as z.infer<typeof RoleSchema>,
  });

  const createRoleMutation = api.teamRoles.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
      form.reset();
    },
    onError: (err) => {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });

  const updateRoleMutation = api.teamRoles.update.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
    onError: (err) => {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof RoleSchema>) => {
    if (role) {
      updateRoleMutation.mutate({
        ...data,
        id: role.id,
      });
      return;
    }
    createRoleMutation.mutate(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {role ? (
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            Редактировать
          </DropdownMenuItem>
        ) : (
          <Button>Создать</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {role ? "Редактировать роль" : "Создать роль"}
          </DialogTitle>
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
                  <FormDescription>Название роли</FormDescription>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Backend Developer"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  updateRoleMutation.isPending || createRoleMutation.isPending
                }
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
