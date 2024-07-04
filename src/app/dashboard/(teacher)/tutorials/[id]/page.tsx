import CreateUpdateTutorial from "~/app/dashboard/(teacher)/tutorials/[id]/create_update";
import { type OneTutorial } from "~/lib/shared/types";
import { api } from "~/trpc/server";

export default async function CreateUpdateTutorialPage({
  params
}: {
  params: {
    id?: string
  }
}) {
  let tutorial: OneTutorial | undefined = undefined;
  const subjects = await api.subject.getAll({});
  const topics = await api.topic.getAll({});

  if (params.id != "create") {
    tutorial = await api.tutorial.getOne({
      id: params.id ?? ""
    });
  }

  return (
    <CreateUpdateTutorial
      tutorial={tutorial}
      topics={topics}
      subjects={subjects}
    />
  );
}

