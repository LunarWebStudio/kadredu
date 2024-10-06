"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { createAvatar } from "@dicebear/core";
import { botttsNeutral as avatarCollection } from "@dicebear/collection";
import Image from "./ui/image";
import { useMemo } from "react";

export default function UserAvatar({
  image,
  className,
  name,
}: {
  image?: string;
  className?: string;
  name: string;
}) {
  const avatar = useMemo(() => {
    return createAvatar(avatarCollection, {
      size: 128,
      seed: name,
    }).toDataUri();
  }, []);

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
        <img
          src={avatar}
          alt="ProfilePicture"
        />
      </AvatarFallback>
    </Avatar>
  );
}
