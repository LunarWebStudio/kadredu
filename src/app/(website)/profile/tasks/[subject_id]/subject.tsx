import {  type Task } from "~/lib/shared/types";

export default function TaskSubjectInfo({
    tasks
} : {
    tasks?: Task[]
}) {
    return (
        <div className="w-full h-screen mt-4">
            <h1 className="mb-6">Задания/{`Предмет`}</h1>

            <div className="flex flex-col gap-6">
                {tasks?.map(task => (
                    <Link href={task.id} className="bg-secondary p-6 rounded-2xl flex flex-col gap-3" key={task.id}>
                        <h3>{task.name}</h3>
                
                        <p>{task.author.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}