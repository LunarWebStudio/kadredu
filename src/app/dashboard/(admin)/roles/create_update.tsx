"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  Dialog
} from "~/components/ui/dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem
} from "~/components/ui/form";
import { RoleInputSchema } from "~/lib/shared/types";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import { type z } from "zod";
import { OnError } from "~/lib/shared/onError";

export default function CreateUpdateRole({
  role
}: {
  role?: { id: string, name: string }
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [dialogState, setDialogState] = useState(false);

  const form = useForm({
    resolver: zodResolver(RoleInputSchema),
    defaultValues: {
      name: role ? role.name : ""
    }
  });


  const CreateRoleMutation = api.teamRoles.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Роль создана"
      });
      setDialogState(false);
      router.refresh();
      form.reset();
    },
    onError: err => {
      toast({
        title: "Ошибка создания роли",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  const UpdateRoleMutation = api.teamRoles.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Роль обновлена"
      });
      setDialogState(false);
      router.refresh();
      form.reset();
    },
    onError: err => {
      toast({
        title: "Ошибка обновления роли",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: z.infer<typeof RoleInputSchema>) => {
    if (role) {
      UpdateRoleMutation.mutate({ id: role.id, name: data.name })
    } else {
      CreateRoleMutation.mutate({ name: data.name })
    }
  }

  return (
    <Dialog
      open={dialogState}
      onOpenChange={setDialogState}
    >
      <DialogTrigger asChild>
        {role ? (
          <DropdownMenuItem onSelect={(e) => { e.preventDefault() }}>Редактировать</DropdownMenuItem>
        ) : (
          <Button>Создать</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? "Редактировать" : "Создать"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, OnError(toast))} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="backend developer"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Название роли</FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit">Сохранить</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
