import NotFoundPage from "~/app/not-found";
import { api } from "~/trpc/server";

export default async function ProfilePage({
  params
}: {
  params: {
    username?: string;
  }
}) {
  const user = await api.user.getOne({
    username: params.username ?? ""
  })

  if (!user) {
    return <NotFoundPage />;
  }

  return (
    <p>
      {user.name}
    </p>
  );
}
