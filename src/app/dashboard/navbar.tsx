import Logo from "~/components/logo";
import Search from "~/app/dashboard/search";

export default function DashboardNavbar() {
  return (
    <div className="flex h-nav-dashboard w-screen flex-row items-center justify-between bg-secondary px-6">
      <Logo dark />
      <div className="flex flex-row gap-4">
        <Search />
      </div>
    </div>
  );
}
