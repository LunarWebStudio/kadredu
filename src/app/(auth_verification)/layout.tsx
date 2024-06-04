import Logo from "~/components/logo";
import ThemeSwitch from "~/components/theme-switcher";

export default function AuthOnboardingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-2">
      <div className="relative flex h-screen flex-col gap-2 bg-primary p-10 text-white dark:bg-background overflow-hidden">
        <Logo inverted />
        <div className="flex grow flex-col items-center justify-center gap-4">
          <div className="mx-auto flex w-1/2 max-w-[26rem] flex-col items-center justify-center gap-6 pb-[15%]">
            <h2>Lorem ipsum dolor sit amet consectetur</h2>
            <p className="text-white/60">
              Lorem ipsum dolor sit amet consectetur. Nec sapien nullam
              vulputate proin pellentesque.
            </p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <p>Светлая</p>
            <ThemeSwitch />
            <p>Темная</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-2/3 aspect-square h-1/5 translate-y-1/2 rounded-full bg-white/60"></div>
      </div>
      <div className="flex items-center justify-center bg-secondary">
        {children}
      </div>
    </div>
  );
}
