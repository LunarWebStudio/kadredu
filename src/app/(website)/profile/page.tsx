import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Profile() {
  const session = await getServerAuthSession();

  const events = await api.github.getUserEvents({username:session?.user.username});

  redirect(`/profile/${session?.user?.username}`);
}
