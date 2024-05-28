import sharp from "sharp";
import { getPlaiceholder } from "plaiceholder";

export async function ProcessImage(imageB64: string) {
  console.log(imageB64);

  const buff = Buffer.from(imageB64, "base64");

  const file = await sharp(buff)
    .resize({
      width: 1000,
      height: 1000,
      fit: "cover"
    })
    .toFormat("webp")
    .toBuffer();

  const { base64 } = await getPlaiceholder(file);

  return { file, blurPreview: base64 };
}
