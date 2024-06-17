'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/use-toast";
import { OnError } from "~/lib/shared/onError";
import { type Resume, ResumeInputSchema, type TeamRole, Statuses } from "~/lib/shared/types";
import { cn } from "~/lib/utils";
import { type Status } from "~/server/db/schema";
import { api } from "~/trpc/react";



export default function ResumeForm({roles,resume}:
  {
    roles:TeamRole[],
    resume:Resume | undefined
  }
){
  const [roleOpen,setRoleOpen] = useState(false)
  const [statusOpen,setStatusOpen] = useState(false)


  const router = useRouter()
  const {toast} = useToast()

  const form = useForm({
    resolver:zodResolver(ResumeInputSchema),
    defaultValues:{
      roleId: resume?.roleId ?? "",
      status: Statuses.find(status => resume?.status == status.code)?.code ?? "",
      experience:resume?.experience ?? ""
    }
  })
  const updateSelfResumeMutation = api.resume.updateSelf.useMutation({
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
  const onSubmit = (data:z.infer<typeof ResumeInputSchema>) => {
    updateSelfResumeMutation.mutate({
      ...data
    })
  }

  return(
    <div className="w-full dark:bg-neutral-900 bg-white rounded-2xl">
      <div className="w-full px-6 py-4 border-b-2 text-lg font-bold dark:border-neutral-700 border-gray-300 dark:text-slate-300 text-slate-500">
        Резюме
      </div>
      <div className="w-full p-6">
         <Form {...form}>
          <form className=" space-y-4" onSubmit={form.handleSubmit((data)=>{
            onSubmit({
              roleId:data.roleId,
              experience:data.experience,
              status:data.status as Status
            })
            OnError(toast)
          })}>
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Роль
                  </FormLabel>
                  <Popover
                    open={roleOpen}
                    onOpenChange={setRoleOpen}
                  >
                    <PopoverTrigger className="hidden w-full lg:flex " asChild>
                      <Button
                        className="w-full justify-between dark:bg-neutral-800 bg-white"
                        variant="outline"
                        type="button"
                      >
                        {
                          roles.find(role => role.id === field.value)
                            ?.name ?? "Выберите роль"
                        }

                        <ChevronDown />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className=" lg:w-[460px]" align="end">
                      <RoleList
                        roles={roles}
                        setCurrentRole={field.onChange}
                        currentRoleId={field.value}
                        setRoleState={setRoleOpen}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({field})=>(
                <FormItem>
                  <FormLabel>
                    Статус
                  </FormLabel>
                  <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        className="w-full justify-between dark:bg-neutral-800 bg-white "
                        variant="outline"
                        type="button"
                      >
                        {
                          Statuses.find(status => status.code === field.value)
                            ?.name ?? "Выберите статус"
                        }
                        <ChevronDown />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {Statuses.map(status => (
                              <CommandItem
                                key={status.code}
                                value={status.name ?? `${undefined}`}
                                onSelect={() => {
                                  field.onChange(status.code);
                                  setStatusOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 size-4",
                                    field.value === status.code ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {status.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({field})=>(
                <FormItem>
                  <FormLabel>Опыт работы</FormLabel>
                  <Textarea className="w-full h-20 dark:bg-neutral-800 bg-white" placeholder="Несколько компаний" {...field}/>
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={updateSelfResumeMutation.isPending}>Сохранить</Button>
          </form>
         </Form>
      </div>
    </div>
  )
}

                  
function RoleList({
  roles,
  currentRoleId,
  setCurrentRole,
  setRoleState
}: {
  roles: TeamRole[],
  currentRoleId: string,
  setCurrentRole: (id: string) => void,
  setRoleState:(arg:boolean) => void
}) {

  return (
    <Command>
      <CommandInput placeholder="Роль..."/>
      <CommandList>
        <CommandEmpty>Роли не найдены.</CommandEmpty>
        <CommandGroup>
          {roles.map(role => (
            <CommandItem 
              key={role.id}
              value={role.name ?? `${undefined}`}
              onSelect={() => {
                setCurrentRole(role.id);
                setRoleState(false)
              }}
            >
              <Check
                className={cn(
                  "mr-2 size-4",
                  currentRoleId === role.id ? "opacity-100" : "opacity-0"
                )}
              />
              {role.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
                  