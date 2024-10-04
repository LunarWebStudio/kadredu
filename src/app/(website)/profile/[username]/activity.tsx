import { eachDayOfInterval, subYears } from "date-fns";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

export async function ActivityWiget({
  username,
}: {
  username: string | null;
}) {
  return (
    <div className="w-full rounded-xl bg-secondary min-h-64 flex flex-col">
      <div className="w-full px-6 py-4 border-b-2 text-lg font-bold text-muted-foreground">
        Активность
      </div>
      <div className="grow w-full flex">
        {username ? (
          <ActivityWigetBody username={username} />
        ) : (
          <div className="grow flex flex-col items-center justify-center gap-2">
            <p className="font-medium">
              Привяжите аккаунт GitHub в настройках чтобы посмотреть свою
              активность
            </p>
            <Link href="/profile/settings">
              <Button>Привязать</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

async function ActivityWigetBody({
  username,
}: {
  username: string;
}) {
  const events = await api.github.getUserEvents({
    username,
  });

  const eventsMap = new Map<string, (typeof events)[number]>();
  for (const event of events) {
    eventsMap.set(event.date, event);
  }

  let colorMap = {
    "#216e39": "bg-primary",
    "#30a14e": "bg-primary/80",
    "#40c463": "bg-primary/60",
    "#9be9a8": "bg-primary/40",
    "#ebedf0": "bg-muted border",
    default: "bg-muted",
  } as const;

  return (
    <div className="grid grid-rows-7 grid-flow-col gap-1 p-6">
      {eachDayOfInterval({
        start: subYears(new Date(), 1),
        end: new Date(),
      }).map((date) => {
        const event = eventsMap.get(date.toISOString().split("T")[0]!);
        let color = colorMap[event?.color ?? "default"];

        return (
          <HoverCard key={date.toISOString()}>
            <HoverCardTrigger
              className={cn("size-4 rounded", color)}
            ></HoverCardTrigger>
            <HoverCardContent>{event?.date}</HoverCardContent>
          </HoverCard>
        );
      })}
    </div>
  );
}
