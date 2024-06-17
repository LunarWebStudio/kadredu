import GetLevel from "~/lib/shared/level";

export default function LevelBar({
  experience
}: {
  experience: number;
}) {
  const level = GetLevel(experience);
  // TODO: Сделать рассчет уровня
  const percent = 30;

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-row w-full items-center justify-between text-primary-gradient text-xs">
        <p>{level}lvl</p>
        <p>{percent}%</p>
      </div>
      <div className="h-[5px] w-full bg-background rounded-full relative">
        <div className="h-[5px] bg-gradient-to-r from-[#CE5BEB] to-primary rounded-full absolute inset-y-0 left-0"
          style={{
            width: `${percent}%`
          }}
        >
        </div>
      </div>
    </div>
  );
}
