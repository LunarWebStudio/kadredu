"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Image from "next/image";

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
  const [key, setKey] = useState("");

  useEffect(() => {
    setKey(image?.storageId ?? "");
  }, [image]);

  const signedUrl = api.image.getPresignedURL.useQuery(
    { key },
    {
      enabled: !!image
    }
  );

  return (
    <Avatar className={className}>
      <AvatarImage
        asChild
        src={signedUrl.data ?? ""}
      >
        <Image
          src={signedUrl.data ?? ""}
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
