export async function ImagesToBase64<F extends readonly File[]>(
  images: F
): Promise<{ [K in keyof F]: string }> {
  const imagesBase64 = await Promise.all(
    images.map(async image => {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = error => reject(error);
      });
      return base64;
    })
  );

  return imagesBase64 as { [K in keyof F]: string };
}
