import { api } from "~/trpc/server";

export default function CreateUpdateTutorial({
    params
} : {
    params : {
        id: string
    }
}) {
    let tutorial: any | undefined = undefined;

    if(params.id !== "create") {
        tutorial = api.tutorial.getOne({
            id: params.id
        })
    }
}