import sharp from "sharp";

export const maxPhotos = 3;
export const maxPhotoBytes = 5 * 1024 * 1024;
export async function preparePhotos(form) {
  const files = form.getAll("photos"), captions = form.getAll("captions");
  if (files.length > maxPhotos || captions.length !== files.length)
    throw Error("Choose up to three photographs, each with its own caption field.");
  const photos = [];
  for (const [index, file] of files.entries()) {
    const caption = captions[index];
    if (!(file instanceof File) || !file.size || file.size > maxPhotoBytes)
      throw Error("Each photograph must be 5 MB or smaller.");
    if (typeof caption !== "string" || caption.length > 180) throw Error("Keep each caption within 180 characters.");
    const bytes = Buffer.from(await file.arrayBuffer());
    const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    const png = bytes.subarray(0,8).equals(Buffer.from("89504e470d0a1a0a","hex"));
    const webp = bytes.toString("ascii",0,4) === "RIFF" && bytes.toString("ascii",8,12) === "WEBP";
    if (!jpeg && !png && !webp) throw Error("Choose a JPEG, PNG or WebP photograph.");
    try {
      const image = await sharp(bytes, { limitInputPixels: 60000000, failOn: "error" })
        .rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 }).toBuffer();
      photos.push({caption: caption.trim(), image});
    } catch {
      throw Error("One photograph could not be read. Try a smaller JPEG, PNG or WebP copy.");
    }
  }
  return photos;
}
