import Logo from "~/components/logo";
import Search from "~/app/dashboard/search";
import UserAvatar from "~/components/avatar";
import { getServerAuthSession } from "~/server/auth";

export default async function DashboardNavbar() {
  const session = await getServerAuthSession();

  return (
    <div className="flex h-nav-dashboard w-screen flex-row items-center justify-between bg-secondary px-6">
      <Logo dark />
      <div className="flex flex-row gap-4">
        <Search />
        <UserAvatar
          image={session?.user.profilePicture ?? undefined}
          name={session?.user.name ?? "Неизвестно"}
        />
      </div>
    </div>
  );
}
