import LogoImage from "../../public/logo.svg";
import Image, { type StaticImageData } from "next/image";

export default function Logo() {
  return (
    <div className="flex flex-row items-center gap-2">
      <Image
        src={LogoImage as StaticImageData}
        alt="Logo"
        className="size-12"
      />
      <p className="text-lg font-bold text-background">KadrEdu</p>
    </div>
  );
}
