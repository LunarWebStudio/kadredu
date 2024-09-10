import ProfileTemplate from "~/app/(website)/profile/[username]/templ";
import GithubConnect from "~/app/(website)/profile/settings/github";
import AboutMeForm from "~/app/(website)/profile/settings/profileInfoForm";
import ResumeForm from "~/app/(website)/profile/settings/resumeForm";
import ThemeSwitcher from "~/app/(website)/profile/settings/themeSwitcher";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function SettingsPage() {
  const session = await getServerAuthSession();
  const roles = await api.teamRoles.getAll();
  const resume = await api.resume.getSelf();
  return (
    <ProfileTemplate
      title="Настройки"
      className="bg-slate-400"
    >
      <AboutMeForm session={session ?? undefined} />
      <GithubConnect />
      <ResumeForm
        roles={roles}
        resume={resume ?? undefined}
      />
      <ThemeSwitcher />
    </ProfileTemplate>
  );
}
