import { notFound } from "next/navigation";
import EditorText from "~/components/Editor";
import TutorialCard from "~/components/tutorial-card";
import { ProfileContent, ProfileHeader, ProfileTitle } from "~/components/ui/profile";
import { api } from "~/trpc/server";
import { TaskForm } from "./form";



// NOTE Какой нибудь onboarding
export default async function TaskPage({ params }:
  {
    params:{
      subject_id: string,
      task_id: string
    }
  }){


  const task = await api.task.getOne({
    id: params.task_id,
  });

  if(!task){
    return notFound()
  }

  return (
    <ProfileContent className="space-y-4 mt-4">
      <ProfileHeader>
        <ProfileTitle className="bg-amber-400">
          Задание - {task?.subject.name} - {task?.name}
        </ProfileTitle>
      </ProfileHeader>
      {
        task.tutorial ? (
        <>
          <TutorialCard tutorial={task.tutorial} isBuy />
        </>
        ) : null
      }
      <div className="w-full rounded-2xl bg-secondary">
        <div className="w-full border-b-2 px-6 py-4 text-lg font-bold text-muted-foreground">
          Описание
        </div>
        <EditorText disabled className="border-none" text={task.description} />
      </div>
      <TaskForm />
    </ProfileContent>
  );
}
