"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import EmojiPicker from "~/components/emoji_picker";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
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
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/use-toast";
import { OnError } from "~/lib/shared/onError";
import {
  type GithubRepository,
  type PortfolioProject,
  PortfolioProjectInputSchema,
} from "~/lib/shared/types";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function CreateUpdatePortfolioProject({
  repos,
  project,
}: {
  repos: GithubRepository[];
  project?: PortfolioProject;
}) {
  const form = useForm({
    resolver: zodResolver(PortfolioProjectInputSchema),
    defaultValues: {
      name: project?.name ?? "",
      emoji: project?.emoji ?? "",
      description: project?.description ?? "",
      repoName: project?.repoName ?? "",
      repoOwner: project?.repoOwner ?? "",
    },
  });

  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const createPortfolioProjectMutation = api.portfolio.create.useMutation({
    onSuccess(proj) {
      toast({
        title: "Проект создан",
      });
      router.push(`/project/${proj.id}`);
    },
    onError(err) {
      toast({
        title: "Ошибка создания проекта",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const updatePortfolioProjectMutation = api.portfolio.update.useMutation({
    onSuccess() {
      toast({
        title: "Проект обновлен",
      });
      router.refresh();
    },
    onError(err) {
      toast({
        title: "Ошибка обновления проекта",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof PortfolioProjectInputSchema>) => {
    if (project) {
      updatePortfolioProjectMutation.mutate({ id: project.id, ...data });
    } else {
      createPortfolioProjectMutation.mutate(data);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {project ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Редактировать
          </DropdownMenuItem>
        ) : (
          <Button>Создать</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить проект</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, OnError(toast))}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Название проекта</FormDescription>
                  <FormControl>
                    <Input
                      placeholder="Название проекта"
                      {...field}
                    />
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
                  <RepoSelect
                    repos={repos}
                    repo={repos.find((r) => r.name === field.value)}
                    setRepo={(repo) => {
                      field.onChange(repo.name);
                      form.setValue("description", repo.description ?? "");
                      form.setValue("name", repo.name ?? "");
                    }}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Описание</FormDescription>
                  <Textarea
                    placeholder="Описание"
                    {...field}
                  />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                disabled={
                  updatePortfolioProjectMutation.isPending ||
                  createPortfolioProjectMutation.isPending
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

function RepoSelect({
  repos,
  repo,
  setRepo,
}: {
  repos: GithubRepository[];
  repo?: GithubRepository;
  setRepo: (repo: GithubRepository) => void;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (repo) {
      setDrawerOpen(false);
      setPopoverOpen(false);
    }
  }, [repo]);

  return (
    <>
      <Popover
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
      >
        <PopoverTrigger
          className="hidden lg:flex"
          asChild
        >
          <Button
            variant="outline"
            className="w-full justify-start"
          >
            {repo?.name ?? "Репозиторий"}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <RepoList
            repos={repos}
            repo={repo}
            setRepo={setRepo}
          />
        </PopoverContent>
      </Popover>

      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      >
        <DrawerTrigger
          className="flex lg:hidden"
          asChild
        >
          <Button
            variant="outline"
            className="w-full justify-start"
          >
            {repo?.name ?? "Репозиторий"}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <RepoList
              repos={repos}
              repo={repo}
              setRepo={setRepo}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function RepoList({
  repos,
  repo,
  setRepo,
}: {
  repos: GithubRepository[];
  repo?: GithubRepository;
  setRepo: (repo: GithubRepository) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Репозиторий..." />
      <CommandList>
        <CommandEmpty>Репозиториев не найдено.</CommandEmpty>
        <CommandGroup>
          {repos.map((r) => (
            <CommandItem
              key={r.name}
              value={r.name}
              onSelect={(val) => {
                const repo = repos.find((rl) => rl.name === val)!;
                setRepo(repo);
              }}
            >
              <Check
                className={cn(
                  "size-4 mr-2",
                  r.name === repo?.name ? "opacity-100" : "opacity-0",
                )}
              />
              {r.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
