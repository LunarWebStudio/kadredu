import { cn } from "~/lib/utils";
import LogoImage from "../../public/logo.svg";
import Image, { type StaticImageData } from "next/image";

export default function Logo({
  inverted,
  size
}: {
  inverted?: boolean,
  size?: "icon" | "full"
}) {
  return (
    <div className="flex select-none flex-row items-center gap-2">
      <Image
        src={LogoImage as StaticImageData}
        alt="Logo"
        className="size-10"
      />
      <p
        className={cn(
          "text-lg font-bold text-white",
          inverted ? "text-white" : "text-black",
          size === "icon" ? "hidden" : "block"
        )}
      >
        KadrEdu
      </p>
    </div>
  );
}
