"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "~/components/ui/form";
import { useToast } from "~/components/ui/use-toast";
import { OnError } from "~/lib/shared/onError";

export default function LoginForm() {
  const formSchema = z.object({
    email: z
      .string({
        required_error: "Не введен Email",
        invalid_type_error: "Некорректныи Email",
      })
      .email("Некорректныи Email"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    signIn("email", { email: data.email, callbackUrl: "/", redirect: false })
      .then(() => {
        const searchParams = new URLSearchParams();
        searchParams.set("complete", "true");

        router.push(`?${searchParams.toString()}`);
        router.refresh();
      })
      .catch(() => {
        toast({
          title: "Не удалось отправить письмо",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="flex w-[400px] flex-col gap-6">
      <p className="emoji">👋</p>
      <h3>Добро пожаловать!</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, OnError)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Введите ваш адрес электронной почты
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button>Получить письмо</Button>
        </form>
      </Form>
    </div>
  );
}
