import { SquareCheck } from "lucide-react";
import Link from "next/link";
import {
  ProfileContent,
  ProfileHeader,
  ProfileTitle,
} from "~/components/ui/profile";
import { api } from "~/trpc/server";

export default async function Tasks() {
  const subjects = await api.subject.getAssigned();

  return (
    <ProfileContent>
      <ProfileHeader>
        <ProfileTitle className="bg-amber-400">Задания</ProfileTitle>
      </ProfileHeader>
      {subjects
        .filter((s) => s.tasks.length !== 0)
        .map((subject) => (
          <Link
            href={`/profile/tasks/${subject.id}`}
            className="p-6 rounded-xl bg-secondary space-y-4 w-full hover:scale-[1.01] transition hover:shadow-lg block text-left"
            key={subject.id}
          >
            <h3>{subject.name}</h3>
            <p>{subject.teacher.name}</p>
            <div className="w-full flex justify-between items-center text-muted-foreground">
              <div className="flex gap-1 items-center">
                <SquareCheck />
                <p>Сделано</p>
              </div>
              <p>{subject.tasks.length}/??</p>
            </div>
          </Link>
        ))}
    </ProfileContent>
  );
}
