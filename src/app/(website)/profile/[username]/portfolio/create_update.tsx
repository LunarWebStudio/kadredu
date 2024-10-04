"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import EmojiPicker from "~/components/emoji_picker";
import { Button } from "~/components/ui/button";
import Combobox from "~/components/ui/combobox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { PopoverTrigger } from "~/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";
import { OnError } from "~/lib/shared/onError";
import { GithubRepository } from "~/lib/shared/types/github";
import {
  OnePortfolioProject,
  PortfolioProjectSchema,
} from "~/lib/shared/types/portfolio";
import { api } from "~/trpc/react";

export default function CreateUpdatePortfolioProject({
  project,
}: {
  project?: OnePortfolioProject;
}) {
  const form = useForm({
    resolver: zodResolver(PortfolioProjectSchema),
    defaultValues: project as z.infer<typeof PortfolioProjectSchema>,
  });

  const [repos] = api.github.getOwnedRepos.useSuspenseQuery();

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const selectedRepository = useMemo(
    () => repos?.find((r) => r.name === form.watch("repoName")),
    [repos, form.watch("repoName")],
  );

  const createPortfolioProjectMutation = api.portfolio.create.useMutation({
    onSuccess() {
      toast.success("Проект создан");
      router.refresh();
      setOpen(false);
    },
    onError(err) {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });

  const updatePortfolioProjectMutation = api.portfolio.update.useMutation({
    onSuccess() {
      toast.success("Проект обновлен");
      router.refresh();
    },
    onError(err) {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof PortfolioProjectSchema>) => {
    if (project) {
      return updatePortfolioProjectMutation.mutate({ id: project.id, ...data });
    }

    return createPortfolioProjectMutation.mutate(data);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {project ? (
          <Button variant="ghost">
            <Pen className="size-4 mr-1" /> Редактировать
          </Button>
        ) : (
          <Button>Создать</Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{project ? "Редактировать" : "Добавить"}</SheetTitle>
        </SheetHeader>
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
                  <FormDescription>Название проекта</FormDescription>
                  <FormControl>
                    <Input placeholder="Название проекта" className="border border-input bg-secondary hover:bg-background hover:text-accent-foreground"  {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emoji"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Эмодзи</FormDescription>
                  <EmojiPicker
                    setEmoji={(val) => {
                      field.onChange(val);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        {field.value}
                      </Button>
                    </PopoverTrigger>
                  </EmojiPicker>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repoName"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Название репозитория</FormDescription>
                  <Combobox
                    values={repos.map((repo) => ({
                      id: repo.name,
                      name: repo.name,
                    }))}
                    value={
                      selectedRepository
                        ? {
                            id: selectedRepository?.name,
                            name: selectedRepository?.name,
                          }
                        : null
                    }
                    onChange={(t) =>  field.onChange(t?.id)}
                    placeholder={{
                      empty: "Выберите репозиторий",
                      default: "Репозиторий...",
                    }}
                  >
                    <Button className="w-full" variant="outline" chevron>
                      {selectedRepository?.name ?? "Выберите репозиторий"}
                    </Button>
                  </Combobox>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Описание</FormDescription>
                  <Textarea placeholder="Описание" className="border border-input bg-secondary hover:bg-background hover:text-accent-foreground" {...field} />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button
                disabled={
                  updatePortfolioProjectMutation.isPending ||
                  createPortfolioProjectMutation.isPending
                }
              >
                Сохранить
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
