import { openJournal, publishedPhoto } from "@/lib/stories.mjs";
import { uuidPattern } from "@/lib/inquiries.mjs";

export const dynamic = "force-dynamic";
export async function GET(_: Request, context: {params: Promise<{id: string; position: string}>}) {
  const {id,position} = await context.params;
  const headers = {"Cache-Control":"private, no-store", "X-Content-Type-Options":"nosniff"};
  if (!uuidPattern.test(id) || !/^[0-2]$/.test(position)) return new Response(null,{status:404,headers});
  const db = openJournal();
  try {
    const bytes = publishedPhoto(db,id,Number(position));
    return bytes ? new Response(new Uint8Array(bytes),{headers:{...headers,"Content-Type":"image/webp"}})
      : new Response(null,{status:404,headers});
  } finally { db.close(); }
}
