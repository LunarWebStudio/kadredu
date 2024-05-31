"use client";

import Image, { type ImageProps } from "next/image";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";

export default function S3Image({
  ...props
}: ImageProps) {
  const presignedUrl = api.image.getPresignedURL.useQuery({
    key: props.src as string
  }, {
    refetchOnWindowFocus: false,
    enabled: !!props.src
  })

  return (
    <>
      {presignedUrl.data ? (
        <Image
          {...props}
          alt={props.alt}
          src={presignedUrl.data}
        />
      ) : (
        <Skeleton className={props.className} />
      )}
    </>
  )
}
