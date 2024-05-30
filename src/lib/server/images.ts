import sharp from "sharp";
import { getPlaiceholder } from "plaiceholder";

export async function ProcessImage(
  imageB64: string,
  size?: {
    width?: number,
    height?: number
  }
) {
  const buff = Buffer.from(imageB64.split(";base64,").pop() ?? "", "base64");
  const file = await sharp(buff)
    .resize({
      width: size?.width ?? 1000,
      height: size?.height ?? 1000,
      fit: "cover"
    })
    .toFormat("webp")
    .toBuffer();

  const { base64 } = await getPlaiceholder(file);

  return { file, blurPreview: base64 };
}
