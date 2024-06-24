import {  type Task } from "~/lib/shared/types";
import { api } from "~/trpc/server";
import Link from "next/link";
import { AlarmClock } from "lucide-react";
import { LucideCircleDollarSign } from "lucide-react";

export default async function TaskSubjectPage({
    params
} : {
    params: {
        subject_id: string
    }
}) {
    const tasks = await api.task.getAllBySubjectId({ id: params.subject_id });
    const date = new Date();
    
    return (
        <div className="w-full h-screen mt-4">
            <h1 className="mb-6 bg-secondary p-6 rounded-2xl"><Link href="/profile/tasks">Задания</Link>/{`Предмет`}</h1>

            <div className="flex flex-col gap-6">
                {tasks?.map(task => (
                    <Link href={`/task/${task.id}`} className="bg-secondary p-6 rounded-2xl flex flex-col gap-3" key={task.id}>
                        <div className="flex justify-between items-center">
                            <h3>{task.name}</h3>

                            {task.isApproved ? (
                                <p className="bg-lime-500 px-2 py-1 rounded-2xl">завершено</p>
                            ) : (
                                <p className="bg-red-600 px-2 py-1 rounded-2xl">не завершено</p>
                            )}
                        </div>

                        <p>осталось: 8 дней</p>
                        <div className="flex gap-5">
                            <div className="flex gap-2">
                                <AlarmClock className="w-6"/>
                                <p>{task.experience}xp</p>
                            </div>

                            <div className="flex gap-2">
                                <LucideCircleDollarSign className="w-6"/>
                                <p>{task.coin} монет</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}