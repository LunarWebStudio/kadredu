import TutorialCard from "~/components/tutorial-card";
import { api } from "~/trpc/server";

export default async function TutorialsPage() {
  const tutorials = await api.tutorial.getAll();
  return (
    <>
      <div className="mt-4 space-y-5 w-full">
        <h3 className=" text-2xl relative">
          Туториалы{" "}
          <div className="absolute -bottom-1 left-0 border-b-2 border-slate-400  w-[34px]"></div>
        </h3>
        {tutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            className="max-w-[895px]"
          >
            <TutorialCard
              key={tutorial.id}
              tutorial={tutorial}
            />
          </div>
        ))}
      </div>
    </>
  );
}
