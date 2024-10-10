import { HoverCard, HoverCardTrigger } from "~/components/ui/hover-card";
import { ProfileContent, ProfileSection, ProfileSectionHeader } from "~/components/ui/profile";
import { api } from "~/trpc/server";


export async function Widgets({username}:{
  username: string
}){

  const projects = await api.portfolio.getByUsername({
    username
  });

  const likes = await api.portfolio.getLikesUser({
    username
  })


  const tutorials = await api.tutorial.getAll({
    username
  })


  return(
    <ProfileSection>
      <ProfileSectionHeader>Виджеты</ProfileSectionHeader>
      <ProfileContent className="p-6 flex flex-row flex-nowrap items-center gap-10 w-full min-h-32">
        <Widget sum={projects.length} message="Проекты" />
        <Widget sum={tutorials.length} message="Туториалы" />
        <Widget sum={likes.length} message="Лайки" />
      </ProfileContent>
    </ProfileSection>
  )
}


export function Widget({ sum, message }:
  {
    sum: number
    message: string
  }){

  
  return(
    <HoverCard>
      <HoverCardTrigger className="w-1/3 hover:bg-violet-500 transition-colors min-h-32 rounded-3xl p-6 shadow-2xl space-y-2">
        <h1>{sum}</h1>
        <p>{message}</p>
      </HoverCardTrigger>
    </HoverCard>
  )
}

