import {  type Task } from "~/lib/shared/types";
import { api } from "~/trpc/server";
import CreateUpdateTask from "~/app/dashboard/(teacher)/tasks/[id]/create_update";

export default async function CreateUpdateTutorialPage({
    params
} : {
    params: {
        id?: string
    }
}) {
    let task: Task | undefined = undefined;
    const subjects = await api.subject.getAll({});
    const tutorials = await api.tutorial.getAll({});
    const groups = await api.group.getAll({});

    if(params.id != "create") {
        task = await api.task.getOne({
            id: params.id?? ""
        })
    }
    
    return <CreateUpdateTask task={task} tutorials={tutorials} subjects={subjects} groups={groups}/>
}