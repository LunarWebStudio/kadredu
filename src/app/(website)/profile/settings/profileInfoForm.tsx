"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pen } from "lucide-react";
import { type Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import EditorText from "~/components/Editor";
import UserAvatar from "~/components/avatar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, RequiredFormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { ImagesToBase64 } from "~/lib/shared/images";
import { OnError } from "~/lib/shared/onError";
import { UserUpdateInputSchema } from "~/lib/shared/types";
import { api } from "~/trpc/react";


export default function AboutMeForm({session}:{
  session?:Session
}) {
  const form = useForm({
    resolver: zodResolver(UserUpdateInputSchema),
    defaultValues: {
      profilePictureImage:"",
      name: session?.user.name ?? "",
      username: session?.user.username ?? "",
      description: session?.user.description ?? "",
    }
  })

  const router = useRouter();
  const { toast } = useToast();
  const updateSelfMutation = api.user.updadeSelf.useMutation({
    onSuccess() {
      toast({
        title:"Профиль сохранен",
      })
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

  const onSubmit = (data: z.infer<typeof UserUpdateInputSchema>) => {
    updateSelfMutation.mutate(data);
  }

  return (
    <div className="w-full dark:bg-neutral-900 bg-white rounded-2xl">
      <div className="w-full px-6 py-4 border-b-2 text-lg font-bold dark:border-neutral-700 border-gray-300 dark:text-slate-300 text-slate-500">
        Аккаунт
      </div>
      <div className="w-full p-6">
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
                     {
                        field.value ?
                          <Avatar className="size-20">
                            <AvatarImage src={field.value} />
                            <AvatarFallback></AvatarFallback>
                          </Avatar>
                          : 
                          <UserAvatar 
                            image={session?.user.profilePicture ?? undefined}
                            name={session?.user.name ?? "Неизвестно"}
                            className="size-20"
                          />
                      }
                      <div className="transition-all ease-in-out duration-300 group-hover:scale-105 absolute translate-y-1/2 right-1/2 translate-x-1/2 bottom-0 size-8 bg-primary flex items-center justify-center rounded-full text-background">
                        <Pen className="size-4" />
                      </div>

                      <input accept="image/png, image/webp, image/jpg, image/jpeg"  type="file" className="hidden" {...field} value="" onChange={(e) => {
                        if (!e.target.files?.[0]) return;

                        ImagesToBase64([e.target.files[0]]).then((images) => {
                          
                          field.onChange(images[0]!);
                        }).catch(() => {
                          toast({
                            title: "Ошибка",
                            description: "Не удалось загрузить изображение",
                            variant: "destructive",
                          })
                        })
                      }} />
                    </label>
                  </div>
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="username"
              render={({field})=>(
                <FormItem>
                  <RequiredFormLabel>НИК</RequiredFormLabel>
                  <FormControl>
                    <Input className="dark:bg-neutral-800 bg-white" type="text" placeholder="Никнейм" {...field}/>
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
                    <Input className="dark:bg-neutral-800 bg-white" type="text" placeholder="Фамилия Имя Отчество" {...field} />
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
                    <EditorText text={field.value} setText={field.onChange} options={{
                      code:true,
                      quotes:true,
                      links:true
                    }}/>
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
    </div>
  )
}