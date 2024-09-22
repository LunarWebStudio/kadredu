import { notFound } from "next/navigation";
import { ProfileContent, ProfileHeader, ProfileTitle } from "~/components/ui/profile";
import { api } from "~/trpc/server";
import { ActivityWiget } from "./activity";

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
    <ProfileContent className="mt-4 space-y-4">
      <ProfileHeader>
        <ProfileTitle className="bg-slate-400 block">Профиль</ProfileTitle>
      </ProfileHeader>
      <ActivityWiget username={user.username!} />

    </ProfileContent>
  )
}
