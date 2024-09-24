"use client";

import { formatDistance } from "date-fns";
import { ru } from "date-fns/locale";
import { BookHeart, Clock, CoinsIcon, Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Tutorial } from "~/lib/shared/types/tutorial";

export default function TutorialCard({
  tutorial,
  isBuy
}: {
  tutorial: Tutorial;
  isBuy?: boolean;
}) {

  return (
    <div className="w-full space-y-4 p-6 rounded-2xl bg-secondary">
      <div className="w-full space-y-2">
        <h1 className="font-bold text-[24px]">{tutorial.name}</h1>
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
      {
        isBuy ?
          null
        : 
        (
          <Button
            className="gap-3 min-w-32 text-lg"
            // onClick={() => {
            //   onSubmit();
            // }}
          >
            <CoinsIcon />
          </Button>
        )
      }
    </div>
  );
}
