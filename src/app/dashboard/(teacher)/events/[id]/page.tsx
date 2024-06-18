import {  type Event } from "~/lib/shared/types";
import { api } from "~/trpc/server";
import CreateUpdateEvent from "~/app/dashboard/(teacher)/events/[id]/create_update";

export default async function CreateUpdateEventPage({
    params
} : {
    params: {
        id?: string
    }
}) {
    let event: Event | undefined = undefined;
    const types = await api.type.getAll({});
    const groups = await api.group.getAll({});

    if(params.id != "create") {
        event = await api.event.getOne({
            id: params.id?? ""
        })
    }
    
    return <CreateUpdateEvent event={event} types={types} groups={groups}/>
}