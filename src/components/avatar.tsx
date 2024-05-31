"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import S3Image from "~/components/s3Image";

export default function UserAvatar({
  image,
  className,
  name
}: {
  image?: {
    storageId: string,
    blurPreview: string
  },
  className?: string,
  name: string
}) {
  return (
    <Avatar className={className}>
      <AvatarImage
        asChild
        src={""}
      >
        <S3Image
          src={image?.storageId ?? ""}
          alt="ProfilePicture"
          blurDataURL={image?.blurPreview}
          placeholder="blur"
          width={40}
          height={40}
        />
      </AvatarImage>
      <AvatarFallback>
        {name
          .split(" ")
          .map(n => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}
