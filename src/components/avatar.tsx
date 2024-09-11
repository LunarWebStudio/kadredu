"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Image from "./ui/image";

export default function UserAvatar({
  image,
  className,
  name,
}: {
  image?: string;
  className?: string;
  name: string;
}) {
  return (
    <Avatar className={className}>
      <AvatarImage
        asChild
        src={`/api/file/${image}`}
      >
        <Image
          src={image ?? ""}
          alt="ProfilePicture"
          width={40}
          height={40}
        />
      </AvatarImage>
      <AvatarFallback>
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}
