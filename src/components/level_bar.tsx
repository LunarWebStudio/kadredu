import GetLevel from "~/lib/shared/level";

export default async function LevelBar({ experience }: { experience: number }) {
  const level = GetLevel(experience);
  const percent = Math.round(
    ((experience ?? 0) / level.xp_to_next_level) * 100,
  );

  return (
    <div className="w-full space-y-2">
      <div className="text-primary-gradient flex w-full flex-row items-center justify-between text-xs font-semibold">
        <p>{level.level} lvl</p>
        <p>{Math.round(percent)}%</p>
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
