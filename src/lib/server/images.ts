import sharp from "sharp";
import { getPlaiceholder } from "plaiceholder";

export async function ProcessImage({
  imageB64,
  size,
  fit
}: {
  imageB64: string,
  size?: {
    width?: number,
    height?: number
  },
  fit?: "cover" | "contain"
}) {
  const buff = Buffer.from(imageB64.split(";base64,").pop() ?? "", "base64");
  const file = await sharp(buff)
    .resize({
      width: size?.width ?? 1000,
      height: size?.height ?? 1000,
      fit: fit ?? "cover",
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .toFormat("webp")
    .toBuffer();

  const { base64 } = await getPlaiceholder(file);

  return { file, blurPreview: base64 };
}
