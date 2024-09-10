"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import GetLevel from "~/lib/shared/level";

export default function LevelBar() {
  return (
    <SessionProvider>
      <LevelBarWithoutProvider />
    </SessionProvider>
  );
}

function LevelBarWithoutProvider() {
  const session = useSession();

  const [level, setLevel] = useState(GetLevel(0));
  const [percent, setPercent] = useState(0);
  const [experience, setExperience] = useState<number | undefined>(undefined);

  useEffect(() => {
    setExperience(session?.data?.user.experiencePoints ?? 0);
  }, [session.data?.user.experiencePoints]);

  useEffect(() => {
    const lvl = GetLevel(session?.data?.user.experiencePoints ?? 0);
    setLevel(lvl);
    setPercent(
      Math.round(
        ((session?.data?.user.experiencePoints ?? 0) / lvl.xp_to_next_level) *
          100,
      ),
    );
  }, [experience]);

  return (
    <div className="w-full space-y-2">
      <div className="text-primary-gradient flex w-full flex-row items-center justify-between text-xs">
        {experience ? (
          <>
            <p>{level.level}lvl</p>
            <p>{Math.round(percent)}%</p>
          </>
        ) : (
          <>
            <Skeleton className="bg-primary-gradient h-4 w-8 rounded opacity-30" />
            <Skeleton className="bg-primary-gradient h-4 w-8 rounded opacity-30" />
          </>
        )}
      </div>
      <div className="relative h-[5px] w-full rounded-full bg-background">
        <div
          className="absolute inset-y-0 left-0 h-[5px] rounded-full bg-gradient-to-r from-[#CE5BEB] to-primary transition-all duration-300 ease-in-out"
          style={{
            width: `${percent}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
