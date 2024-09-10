"use client";

import NextImage, { type ImageProps } from "next/image";

export default function Image({ ...props }: ImageProps) {
  return (
    <NextImage
      {...props}
      alt={props.alt}
      src={`/api/file/${props.src}`}
    />
  );
}
