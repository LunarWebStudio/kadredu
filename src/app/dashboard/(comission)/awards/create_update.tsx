'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Coins, ExpandIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import Combobox from "~/components/ui/combobox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { Form, FormControl, FormDescription, FormField, FormItem } from "~/components/ui/form"
import Image from "~/components/ui/image"
import { Input } from "~/components/ui/input"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet"
import { Skeleton } from "~/components/ui/skeleton"
import { OnError } from "~/lib/shared/onError"
import { Achievement, AchievementSchema } from "~/lib/shared/types/achievements"
import { api } from "~/trpc/react"
import { eventTypes } from "~/lib/shared/types/achievements"



export default function CreateUpdateAwards({achievement}:
  {
    achievement?: Achievement
  }) {

  const router = useRouter()

  const [sheetOpen, setSheetOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(AchievementSchema),
    defaultValues: achievement as unknown as z.infer<typeof AchievementSchema>
  })

  const selectedEvent = useMemo(
    () => eventTypes.find(e => e.code === form.watch("eventType")),
    [form.watch("eventType")]
  )


  const createAchievementMutation = api.achievements.create.useMutation({
    onSuccess: () => {
      toast.success("Достижение создано")
      form.reset()
      router.refresh()
      setSheetOpen(false)
    },
    onError: (err) =>{
      toast.error("Ошибка", {
        description: err.message
      })
    }
  })

  const updateAchievementMutation = api.achievements.update.useMutation({
    onSuccess: () => {
      toast.success("Достижение обновлено")
      form.reset()
      router.refresh()
      setSheetOpen(false)
    },
    onError: (err) =>{
      toast.error("Ошибка", {
        description: err.message
      })
    }
  })

  const onSubmit = ( data: z.infer<typeof AchievementSchema>) => {
    if(achievement){
      return updateAchievementMutation.mutate({
        ...data,
        id: achievement.id
      })
    }
    createAchievementMutation.mutate({
      ...data,
    })
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        {
          achievement ? (
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Редактировать
            </DropdownMenuItem>
          ) :(
            <Button>Создать</Button>
          )
        }
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {achievement ? "Редактировать достижение" : "Создать достижение"}
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, OnError)}
            className="space-y-6"
          >

            <div className="border rounded-xl p-6 sspace-y-6">
              <div className="flex flex-row gap-4 items-center text-base lg:text-lg text-nowrap">
                {form.watch("image.b64") ? (
                  <img
                    src={form.watch("image.b64")}
                    width={60}
                    height={60}
                    className="object-contain size-14"
                    alt="Image"
                  />
                ) : (
                  <>
                    {achievement ? (
                      <Image
                        src={achievement.imageId}
                        alt={achievement.name}
                        width={500}
                        height={500}
                        className="size-14 object-contain"
                      />
                    ) : (
                      <Skeleton className="size-14 rounded-md" />
                    )}
                  </>
                )}
                <div className="font-bold gap-1 flex flex-col">
                  <p>
                    {form.watch("name") ?? "Не указано"}
                  </p>
                    {form.watch("description") ?? "Не указано"}
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Изображение достижения</FormDescription>
                  <FormControl>
                    <Input
                      type="file"
                      {...field}
                      value=""
                      max={5}
                      accept="image/png, image/jpeg, image/webp"
                      onUpload={(files) => {
                        if (!files?.[0]) return;
                        field.onChange(files[0]);
                      }}
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
                  <FormDescription>Название достижения</FormDescription>
                  <FormControl>
                    <Input
                      className="border border-input bg-secondary hover:bg-background hover:text-accent-foreground"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Тип события</FormDescription>
                  <Combobox
                    values={eventTypes.map(event => ({
                      id: event.code,
                      name: event.name
                    }))}
                    value={
                      selectedEvent
                        ? {
                          id:selectedEvent.code,
                          name:selectedEvent.name
                        }
                      : null
                    }
                    onChange={(t) =>  field.onChange(t?.id)}
                    placeholder={{
                      empty: "Выберите тип события",
                      default: "Событие...",
                    }}
                  >
                    <Button className="w-full" variant="outline" chevron>
                      {selectedEvent?.name ?? "Выберите тип события"}
                    </Button>
                  </Combobox>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventAmount"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Количество событий</FormDescription>
                  <FormControl>
                    <Input
                      className="border border-input bg-secondary hover:bg-background hover:text-accent-foreground"
                      type="number"
                      min={0}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-row gap-4 justify-between">
              <FormField
                control={form.control}
                name="rewardAmount"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormDescription>Сумма награды</FormDescription>
                    <FormControl>
                      <Input
                        className= "grow border border-input bg-secondary hover:bg-background hover:text-accent-foreground"
                        type="number"
                        min={1}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rewardType"
                render={({ field }) => (
                  <FormItem>
                    <FormDescription>Тип</FormDescription>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          {form.watch("rewardType") ? <Coins/> : <ExpandIcon/>}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="flex w-full items-center">
                        <DropdownMenuItem onSelect={() => field.onChange("COINS")}><Coins/></DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => field.onChange("EXPERIENCE")}><ExpandIcon/></DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Способ получения</FormDescription>
                  <FormControl>
                    <Input
                      className="border border-input bg-secondary hover:bg-background hover:text-accent-foreground"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
              />

            <SheetFooter>
              <Button 
                type="submit"
                disabled={
                  createAchievementMutation.isPending ||
                  updateAchievementMutation.isPending
                }
              >
                Сохранить
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
