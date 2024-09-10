"use client";

import NextImage, { type ImageProps as NextImageProps } from "next/image";

export interface ImageProps extends NextImageProps {}

export default function Image({ ...props }: ImageProps) {
  return (
    <NextImage
      {...props}
      alt={props.alt}
      src={`/api/file/${props.src}`}
    />
  );
}
