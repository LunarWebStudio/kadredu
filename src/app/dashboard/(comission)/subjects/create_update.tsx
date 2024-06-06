"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommandList } from "cmdk";
import { Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "~/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "~/components/ui/popover";
import { toast } from "~/components/ui/use-toast";
import { OnError } from "~/lib/shared/onError";
import {
  type User,
  type Subject,
  SubjectInputSchema
} from "~/lib/shared/types";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function CreateUpdateSubject({
  subject,
  teachers
}: {
  subject?: Subject,
  teachers: User[]
}) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(SubjectInputSchema),
    defaultValues: {
      teacherId: subject ? subject.teacherId : "",
      name: subject ? subject.name : ""
    }
  });
  const [dialogOpen, setDialogOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const CreateSubjectMutation = api.subject.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Предмет создан"
      });
      router.refresh();
      setDialogOpen(false)
    },
    onError: err => {
      toast({
        title: "Ошибка создания предмета",
        description: err.message,
        variant: "destructive"
      });
    }
  });
  const UpdateSubjectMutation = api.subject.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Предмет обновлен"
      });
      router.refresh();
      setDialogOpen(false)
    },
    onError: err => {
      toast({
        title: "Ошибка обновления предмета",
        description: err.message,
        variant: "destructive"
      });
    }
  });
  const onSubmit = (data: z.infer<typeof SubjectInputSchema>) => {
    if (subject) {
      UpdateSubjectMutation.mutate({
        id: subject.id,
        name: data.name,
        teacherId: data.teacherId
      })
    }
    else {
      CreateSubjectMutation.mutate({
        name: data.name,
        teacherId: data.teacherId
      })
    }
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {subject ? (
          <DropdownMenuItem onSelect={e => e.preventDefault()}>
            Редактировать
          </DropdownMenuItem>
        ) : (
          <Button>Создать</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {subject ? "Редактировать предмет" : "Создать предмет"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className=" space-y-6" onSubmit={form.handleSubmit(onSubmit, OnError(toast))}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Математика"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Название предмета</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <Popover
                    open={popoverOpen}
                    onOpenChange={setPopoverOpen}

                  >
                    <PopoverTrigger className="hidden w-full lg:flex ">
                      <Button
                        className="w-full justify-between"
                        variant="outline"
                        type="button"
                      >
                        {
                          teachers.find(teacher => teacher.id === field.value)
                            ?.name ?? "Преподаватель"
                        }
                        <ChevronDown />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className=" lg:w-[460px]">
                      <TeacherList
                        teachers={teachers}
                        setCurrentTeacher={field.onChange}
                        currentTeacherId={field.value}
                      />
                    </PopoverContent>
                  </Popover>

                  <Drawer
                    open={drawerOpen}
                    onOpenChange={setDrawerOpen}
                  >
                    <DrawerTrigger className="flex lg:hidden w-full">
                      <Button
                        className="w-full justify-between"
                        variant="outline"
                        type="button"
                      >
                        {teachers.find(teacher => teacher.id === field.value)
                          ?.name ?? "Преподаватель"}
                        <ChevronDown />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="w-full">
                      <div className="mt-4 border-t">
                        <TeacherList
                          teachers={teachers}
                          setCurrentTeacher={field.onChange}
                          currentTeacherId={field.value}
                        />
                      </div>
                    </DrawerContent>
                  </Drawer>
                  <FormDescription>Преподаватель</FormDescription>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className=" ml-auto" disabled={UpdateSubjectMutation.isPending || CreateSubjectMutation.isPending}>Сохранить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function TeacherList({
  teachers,
  currentTeacherId,
  setCurrentTeacher
}: {
  teachers: User[],
  currentTeacherId: string,
  setCurrentTeacher: (id: string) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Роль..." />
      <CommandList>
        <CommandEmpty>Преподавателей не найдено.</CommandEmpty>
        <CommandGroup>
          {teachers.map(teacher => (
            <CommandItem
              key={teacher.id}
              value={teacher.name ?? `${undefined}`}
              onSelect={() => {
                setCurrentTeacher(teacher.id);
              }}
            >
              <Check
                className={cn(
                  "mr-2 size-4",
                  currentTeacherId === teacher.id ? "opacity-100" : "opacity-0"
                )}
              />
              {teacher.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
