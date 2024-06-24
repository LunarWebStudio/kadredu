import {  type Task } from "~/lib/shared/types";
import { api } from "~/trpc/server";
import Link from "next/link";

export default async function TaskSubjectPage({
    params
} : {
    params: {
        id: string
    }
}) {
    const tasks = await api.task.getOne({ id: params.id });
    
    return (
        <div className="w-full h-screen mt-4">
            <h1 className="mb-6 bg-secondary p-6 rounded-2xl">Задания/{`Предмет`}/{`Задание`}</h1>

            <div className="flex flex-col gap-6">
                <div className="bg-secondary p-6 rounded-2xl flex flex-col gap-3">
                    <h3>{tasks?.name}</h3>
                
                    <p>{tasks?.coin}</p>
                </div>
            </div>
        </div>
    )
}