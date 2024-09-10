import { notFound } from "next/navigation";
import { api } from "~/trpc/server";

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

  return <p>{user.name}</p>;
}
