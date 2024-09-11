import {
  ProfileContent,
  ProfileHeader,
  ProfileTitle,
} from "~/components/ui/profile";
import GithubConnect from "~/app/(website)/profile/settings/github";
import ThemeSwitcher from "~/app/(website)/profile/settings/themeSwitcher";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import PersonalInformation from "./personal_information";
import Resume from "./resume";

export default async function SettingsPage() {
  const session = await getServerAuthSession();
  const resume = await api.resume.getSelf();
  return (
    <ProfileContent>
      <ProfileHeader>
        <ProfileTitle className="bg-slate-400">Настройки</ProfileTitle>
      </ProfileHeader>
      <PersonalInformation session={session ?? undefined} />
      <GithubConnect session={session!} />
      <Resume resume={resume ?? undefined} />
      <ThemeSwitcher />
    </ProfileContent>
  );
}
