"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, RequiredFormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/use-toast";
import { ImagesToBase64 } from "~/lib/shared/images";
import { OnError } from "~/lib/shared/onError";
import { api } from "~/trpc/react";

export default function VerificationForm() {
  const formSchema = z.object({
    profilePictureImage: z.string().optional(),
    name: z.string({
      required_error: "Заполните имя",
      invalid_type_error: "Имя должно быть строкой",
    }).min(1, "Заполните имя"),
    description: z.string().optional(),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profilePictureImage: "",
      name: "",
      description: "",
    }
  })

  const router = useRouter();
  const { toast } = useToast();
  const updateSelfMutation = api.user.updadeSelf.useMutation({
    onSuccess() {
      router.refresh();
    },
    onError(err) {
      toast({
        title: "Ошибка",
        description: err.message,
        variant: "destructive",
      })
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateSelfMutation.mutate(data);
  }

  return (
    <div className="flex w-[400px] flex-col gap-6">
      <p className="emoji">✏️</p>
      <h3>Расскажите о себе</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, OnError(toast))} className="space-y-4">
          <FormField
            control={form.control}
            name="profilePictureImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ФОТО</FormLabel>
                <div className="flex items-center justify-center">
                  <label className="relative size-fit group cursor-pointer">
                    <Avatar className="size-20">
                      <AvatarImage src={field.value} />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <div className="transition-all ease-in-out duration-300 group-hover:scale-105 absolute translate-y-1/2 right-1/2 translate-x-1/2 bottom-0 size-8 bg-primary flex items-center justify-center rounded-full text-background">
                      <Pen className="size-4" />
                    </div>
                    <input
                      accept="image/png, image/webp, image/jpg, image/jpeg"
                      type="file"
                      className="hidden"
                      {...field}
                      value=""
                      onChange={async (e) => {
                        if (!e.target.files?.[0]) return;
                        field.onChange((await ImagesToBase64([e.target.files[0]] as const))[0])
                      }} />
                  </label>
                </div>
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
                  <Input type="text" placeholder="Фамилия Имя Отчество" {...field} />
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
                <FormControl>
                  <Textarea placeholder="Расскажите нам о себе" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit"
            className="w-full"
            disabled={updateSelfMutation.isPending}
          >Продолжить</Button>
        </form>
      </Form>
    </div>
  )
}
