import {
  ProfileContent,
  ProfileHeader,
  ProfileTitle,
} from "~/components/ui/profile";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import PersonalInformation from "./personal_information";
import Resume from "./resume";
import GithubConnect from "./github";
import ThemeSwitcher from "./themeSwitcher";

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
