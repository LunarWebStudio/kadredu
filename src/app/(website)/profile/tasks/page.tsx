import Link from "next/link";
import { api } from "~/trpc/server";


export default async function TasksProfile() {
    const subjects = await api.subject.getAll({});

    return (
        <div className="w-full h-screen mt-4">
            <h1 className="mb-6">Задания</h1>

            <div className="flex flex-col gap-6">
                {subjects.map(subject => (
                    <Link href={`/profile/tasks/${subject.id}`} className="bg-secondary p-6 rounded-2xl flex flex-col gap-3" key={subject.id}>
                        <h3>{subject.name}</h3>

                        <p>{subject.teacherInfo.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}