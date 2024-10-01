"use client";

import { formatDistance } from "date-fns";
import { ru } from "date-fns/locale";
import { BookHeart, Clock, Heart } from "lucide-react";
import Link from "next/link";
import { Tutorial } from "~/lib/shared/types/tutorial";

export default function TutorialCard({
  tutorial,
}: {
  tutorial: Tutorial;
}) {

  return (
      <div className="w-full space-y-4 p-6 rounded-2xl bg-secondary">
        <div className="w-full space-y-2">
          <Link href={`/tutorial/${tutorial.id}`}>
            <h1 className="font-bold text-[24px]">{tutorial.name}</h1>
          </Link>
          <p className="text-[16px]">
            Обновлено{" "}
            {formatDistance(tutorial.createdAt!, new Date(), {
              addSuffix: true,
              locale: ru,
            })}
          </p>
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
      </div>
  );
}
