"use client";

import Image, { type ImageProps } from "next/image";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { useState } from "react";
import { ImageOff } from "lucide-react";

export default function S3Image({
  ...props
}: ImageProps) {
  const presignedUrl = api.image.getPresignedURL.useQuery({
    key: props.src as string
  }, {
    refetchOnWindowFocus: false,
    enabled: !!props.src
  })

  const [error, setError] = useState(false);

  return (
    <>
      {error || !props.src ? (
        <div className={props.className + "flex items-center justify-center bg-muted text-muted-foreground"}>
          <ImageOff className="size-[20%] animate-pulse" />
        </div>
      ) : (
        <>
          {presignedUrl.data ? (
            <Image
              {...props}
              alt={props.alt}
              src={presignedUrl.data}
              onError={() => setError(true)}
            />
          ) : (
            <Skeleton className={props.className} />
          )}
        </>
      )}
    </>
  )
}
