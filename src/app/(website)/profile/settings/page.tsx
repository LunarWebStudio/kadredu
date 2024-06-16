import AboutMeForm from "~/app/(website)/profile/settings/profileInfoForm";
import { getServerAuthSession } from "~/server/auth";
import GithubConnect from "~/app/(website)/profile/settings/github";
import { api } from "~/trpc/server";
import ResumeForm from "~/app/(website)/profile/settings/resumeForm";
import ThemeSwitcher from "~/app/(website)/profile/settings/themeSwitcher";

export default async function SettingsPage(){
  const session = await getServerAuthSession()
  const roles = await api.teamRoles.getAll()
  // console.log(session?.user.profilePicture)

  return(
    <>
      <AboutMeForm session={session ?? undefined} />
      <GithubConnect />
      <ResumeForm roles={roles}/>
      <ThemeSwitcher />
    </>
  )
}