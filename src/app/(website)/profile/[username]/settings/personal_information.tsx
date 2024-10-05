"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pen } from "lucide-react";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import EditorText from "~/components/Editor";
import UserAvatar from "~/components/avatar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  RequiredFormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ConvertFiles } from "~/lib/client/file";
import { OnError } from "~/lib/shared/onError";
import { UserUpdateSchema } from "~/lib/shared/types/user";
import { api } from "~/trpc/react";

export default function PersonalInformation({
  session,
}: {
  session?: Session;
}) {
  const form = useForm({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: session?.user as z.infer<typeof UserUpdateSchema>,
  });

  const router = useRouter();
  const updateSelfMutation = api.user.updateSelf.useMutation({
    onSuccess() {
      toast.success("Профиль обновлен");
      router.refresh();
    },
    onError(err) {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof UserUpdateSchema>) => {
    updateSelfMutation.mutate(data);
  };

  return (
    <div className="w-full bg-secondary rounded-2xl">
      <div className="w-full px-6 py-4 border-b-2 text-lg font-bold text-muted-foreground">
        Аккаунт
      </div>
      <div className="w-full p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, OnError)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ФОТО</FormLabel>
                  <div className="flex items-center justify-center">
                    <label className="relative size-fit group cursor-pointer">
                      {field.value?.b64 ? (
                        <Avatar className="size-20">
                          <AvatarImage src={field.value.b64} />
                          <AvatarFallback></AvatarFallback>
                        </Avatar>
                      ) : (
                        <UserAvatar
                          image={session?.user.image?.id ?? undefined}
                          name={session?.user.name ?? "Неизвестно"}
                          className="size-20"
                        />
                      )}
                      <div className="group-hover:scale-105 transition absolute translate-y-1/2 right-1/2 translate-x-1/2 bottom-0 size-8 bg-primary flex items-center justify-center rounded-full text-background">
                        <Pen className="size-4 text-primary-foreground" />
                      </div>

                      <input
                        accept="image/png, image/webp, image/jpg, image/jpeg"
                        type="file"
                        className="hidden"
                        {...field}
                        value=""
                        onChange={async (e) => {
                          if (!e.target.files?.[0]) return;
                          field.onChange(
                            (await ConvertFiles([e.target.files[0]]))[0]!,
                          );
                        }}
                      />
                    </label>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>НИК</RequiredFormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Никнейм"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>ФИО</RequiredFormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Фамилия Имя Отчество"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>О себе</FormLabel>
                  <FormControl className="">
                    <EditorText
                      text={field.value ?? ""}
                      setText={field.onChange}
                      options={{
                        code: true,
                        quotes: true,
                        links: true,
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={updateSelfMutation.isPending}
            >
              Сохранить
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
