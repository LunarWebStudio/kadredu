import { Tutorial } from "~/lib/shared/types";
import { api } from "~/trpc/server";
import CreateUpdateTutorial from "./create_update";

export default async function CreateUpdateTutorialPage({
    params
} : {
    params: {
        id?: string
    }
}) {
    let tutorial: Tutorial | undefined = undefined;
    if(params.id !== "create") {
         tutorial = await api.tutorial.getOne({
            id: params.id?? ""
        })
    }
    const subjects = await api.subject.getAll({});
    const topics = await api.topic.getAll({});

    return <CreateUpdateTutorial tutorial={tutorial} topics={topics} subjects={subjects}/>
}