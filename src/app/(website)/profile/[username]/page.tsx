import { notFound } from "next/navigation";
import {
  ProfileContent,
  ProfileHeader,
  ProfileTitle,
} from "~/components/ui/profile";
import { api } from "~/trpc/server";
import { ActivityWiget } from "./activity";
import AboutSection from "./about";
import { Widgets } from "./widgets";

export default async function ProfilePage({
  params,
}: {
  params: {
    username?: string;
  };
}) {
  const user = await api.user.getOne({
    username: params.username ?? "",
  });

  if (!user) {
    return notFound();
  }

  return (
    <ProfileContent className="mt-4 space-y-6">
      <ProfileHeader>
        <ProfileTitle className="bg-slate-400">Профиль</ProfileTitle>
      </ProfileHeader>
      <div className="max-w-full overflow-hidden flex flex-col gap-6">
        <AboutSection text={user.description ?? ""} />
        <ActivityWiget username={user.githubUsername} />
        <Widgets username={user.username} />
      </div>
    </ProfileContent>
  );
}
