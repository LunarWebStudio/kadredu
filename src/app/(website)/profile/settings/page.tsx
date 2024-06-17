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
      <div className="mt-4 space-y-5">
        <h3 className=" text-2xl relative">Настройки <div className="absolute -bottom-1 left-0 border-b-2 border-slate-400  w-[34px]"></div></h3>
          <AboutMeForm session={session ?? undefined} />
          <GithubConnect />
          <ResumeForm roles={roles}/>
          <ThemeSwitcher />
      </div>
    </>
  )
}