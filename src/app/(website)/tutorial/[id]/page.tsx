import { formatDistance } from "date-fns"
import { ru } from "date-fns/locale"
import { BookHeart, Clock, Heart } from "lucide-react"
import NotFoundPage from "~/app/not-found"
import Editor from "~/components/Editor"
import { api } from "~/trpc/server"

export default async function TutorialReadPage({ params }:
  {
    params: {
      id?: string
    }
  }
) {
  const tutorial = await api.tutorial.getOne({ id: params.id ?? "" })

  if (!tutorial) return <NotFoundPage />

  return (
    <div className="px-[120px] space-y-5 py-[60px]">
      <div className="w-full bg-secondary p-6 rounded-2xl flex justify-between">
        <h3>Задания/Предметы</h3>
        <p className="text-base text-slate-500">16/20</p>
      </div>
      <div className="w-full space-y-4 p-6 rounded-2xl bg-secondary">
        <div className="w-full space-y-2">
          <h1 className="font-bold text-[24px]">{tutorial.name}</h1>
          <p className="text-[16px]">Обновлено {formatDistance(tutorial.createdAt!, new Date(), { addSuffix: true, locale: ru })}</p>
        </div>
        <div className="flex justify-start gap-4 w-full">
          <div className="flex gap-2">
            <BookHeart className="size-6" />
            {tutorial.topic.name}
          </div>
          <div className="flex gap-2">
            <Clock />
            {tutorial.timeRead} мин
          </div>
          <div className="flex gap-2">
            <Heart />
            {/* TODO добавить лайки*/}
            {0}
          </div>
        </div>
        <Editor text={tutorial.text} disabled />

      </div>


    </div>
  )
}
