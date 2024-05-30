import Logo from "~/components/logo";

export default function AuthOnboardingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-2">
      <div className="relative flex h-screen flex-col gap-2 bg-primary p-10">
        <Logo />
        <div className="mx-auto flex h-2/3 w-1/2 max-w-[26rem] grow flex-col items-center justify-center gap-6 pb-[15%]">
          <h2 className="text-background">
            Lorem ipsum dolor sit amet consectetur
          </h2>
          <p className="text-background/60">
            Lorem ipsum dolor sit amet consectetur. Nec sapien nullam vulputate
            proin pellentesque.
          </p>
        </div>
        <div className="absolute bottom-0 left-2/3 aspect-square h-1/5 translate-y-1/2 rounded-full bg-background/60"></div>
      </div>
      <div className="flex items-center justify-center">{children}</div>
    </div>
  );
}
