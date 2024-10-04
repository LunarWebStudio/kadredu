import { formatRelative } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ProfileContent,
  ProfileHeader,
  ProfileTitle,
} from "~/components/ui/profile";
import { api } from "~/trpc/server";

export default async function Tasks({
  params,
}: {
  params: {
    subject_id: string;
  };
}) {
  const subject = await api.subject.getOne({
    id: params.subject_id,
  });

  if (!subject) {
    notFound();
  }

  const tasks = await api.task.getAssigned({
    id: params.subject_id,
  });

  return (
    <ProfileContent>
      <ProfileHeader>
        <ProfileTitle className="bg-amber-400">
          Задания - {subject.name}
        </ProfileTitle>
      </ProfileHeader>
      {tasks.map((task) => (
        <Link
          href={`/profile/tasks/${params.subject_id}/${task.id}`}
          className="p-6 rounded-xl bg-secondary space-y-4 w-full hover:scale-[1.01] transition hover:shadow-lg block text-left"
          key={task.id}
        >
          <h3>{task.name}</h3>
          <p>
            {task.deadline
              ? formatRelative(task.deadline, new Date(), { locale: ru })
              : "Без срока сдачи"}
          </p>
          <div className="items-center flex gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="size-6 bg-red-400"></div>
              {task.experience}
            </div>
            <div className="flex items-center gap-1">
              <div className="size-6 bg-red-400"></div>
              {task.coins}
            </div>
          </div>
        </Link>
      ))}
    </ProfileContent>
  );
}
