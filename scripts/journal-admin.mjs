import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { openJournal, moderateStory } from "../src/lib/stories.mjs";
import { uuidPattern } from "../src/lib/inquiries.mjs";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
}

export function journalAdmin(directory, action, id, state) {
  const db = openJournal(directory);
  try {
    if (action === "stories") {
      console.table(db.prepare("SELECT id,title,byline,state,created FROM guest_stories ORDER BY created DESC").all());
      return;
    }
    if (!uuidPattern.test(id || "")) throw Error("Supply the story ID from the list.");
    if (action === "story-status") {
      moderateStory(db,id,state);
      console.log("Story status saved.");
      return;
    }
    const story = db.prepare("SELECT * FROM guest_stories WHERE id=?").get(id);
    if (!story) throw Error("Story not found.");
    const photos = db.prepare("SELECT caption,image FROM guest_photos WHERE story=? ORDER BY position").all(id);
    const preview = join(directory,"story-reviews");
    mkdirSync(preview,{recursive:true,mode:0o700});
    const file = join(preview,id+".html");
    const figures = photos.map(photo => `<figure><img alt="" src="data:image/webp;base64,${Buffer.from(photo.image).toString("base64")}"><figcaption>${escapeHtml(photo.caption)}</figcaption></figure>`);
    writeFileSync(file,`<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'"><title>Private story review</title>
      <style>body{max-width:800px;margin:40px auto;padding:16px;font:18px/1.55 Georgia;color:#294637}img{max-width:100%;max-height:520px}p{white-space:pre-wrap;overflow-wrap:anywhere}</style>
      <h1>${escapeHtml(story.title)}</h1><p>By ${escapeHtml(story.byline)} · ${escapeHtml(story.state)}</p><p>${escapeHtml(story.body)}</p>
      ${story.service ? "<h2>Traveling with OMI</h2><p>"+escapeHtml(story.service)+"</p>" : ""}${figures.join("")}`,{mode:0o600});
    console.log("Open this private preview to review the entry and its photographs:",file);
  } finally { db.close(); }
}
