import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth"

export default async function Profile() {
  const session = await getServerAuthSession();

  redirect(`/profile/${session?.user?.username}`);
}
