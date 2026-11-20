import { uuidPattern } from "@/lib/inquiries.mjs";
import { openJournal, readStoryFields, saveStory } from "@/lib/stories.mjs";
import { maxPhotos, maxPhotoBytes, preparePhotos } from "@/lib/story-photos.mjs";

export const runtime = "nodejs";
const fail = (error: string, status: number) => Response.json({error}, {status});
const maxBody = maxPhotos * maxPhotoBytes + 96000;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site" ||
      (origin && URL.canParse(origin) && new URL(origin).host !== request.headers.get("host")) ||
      (origin && !URL.canParse(origin))) return fail("Use the guest journal form to send a story.",403);
  const key = request.headers.get("idempotency-key");
  if (!key || !uuidPattern.test(key)) return fail("Refresh the form and try again.",400);
  const type = request.headers.get("content-type") || "";
  if (!type.startsWith("multipart/form-data;")) return fail("Use the guest journal upload form.",415);
  if (Number(request.headers.get("content-length")) > maxBody) return fail("The upload is too large.",413);
  const reader = request.body?.getReader();
  if (!reader) return fail("Add your story before submitting.",400);
  let form;
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const {done,value} = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxBody) { await reader.cancel(); return fail("The upload is too large.",413); }
      chunks.push(value);
    }
    form = await new Response(Buffer.concat(chunks), { headers: {"content-type": type} }).formData();
  } catch { return fail("The upload was incomplete. Please try again.",400); }
  let story, photos;
  try {
    story = readStoryFields(form);
    photos = await preparePhotos(form);
  } catch (error) { return fail((error as Error).message,400); }
  try {
    const db = openJournal();
    try { return Response.json({ reference: saveStory(db,key,story,photos) }, {status:201}); }
    finally { db.close(); }
  } catch (error) {
    if ((error as Error).message === "CHANGED") return fail("The previous version was received. Reload to start a new entry.",409);
    return fail("The journal cannot receive this story right now. Please try again later.",503);
  }
}
