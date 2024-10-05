import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Profile() {
  const session = await getServerAuthSession();

  redirect(`/profile/${session?.user?.username}`);
}
