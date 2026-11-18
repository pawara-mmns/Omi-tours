import {
  openDatabase,
  storeInquiry,
  uuidPattern,
  validateInquiry,
} from "@/lib/inquiries.mjs";
export const runtime = "nodejs";
const reply = (body: object, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Next.js may normalize a loopback URL to localhost. The Host header retains
  // the actual public host and port used by the browser.
  if (origin) {
    let sameHost = false;
    try {
      sameHost = new URL(origin).host === request.headers.get("host");
    } catch {}
    if (!sameHost || request.headers.get("sec-fetch-site") === "cross-site")
      return reply({ error: "Please use the inquiry form on this site." }, 403);
  }
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return reply({ error: "Use the online inquiry form." }, 415);
  const key = request.headers.get("idempotency-key");
  if (!key || !uuidPattern.test(key))
    return reply({ error: "Refresh the form and try again." }, 400);
  const reader = request.body?.getReader();
  if (!reader) return reply({ error: "The request is empty." }, 400);
  let payload;
  try {
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 24000) {
        await reader.cancel();
        return reply({ error: "Please shorten the inquiry." }, 413);
      }
      chunks.push(value);
    }
    payload = validateInquiry(
      JSON.parse(Buffer.concat(chunks).toString("utf8")),
    );
  } catch (error) {
    return reply(
      {
        error:
          error instanceof SyntaxError
            ? "Check the form and try again."
            : (error as Error).message,
      },
      400,
    );
  }
  try {
    const db = openDatabase();
    try {
      return reply({ reference: storeInquiry(db, key, payload) }, 201);
    } finally {
      db.close();
    }
  } catch (error) {
    if ((error as Error).message === "REQUEST_CHANGED")
      return reply(
        {
          error:
            "Your previous request was already saved. Start a new inquiry to send changes.",
        },
        409,
      );
    return reply(
      { error: "Your inquiry could not be saved. Please try again." },
      503,
    );
  }
}
