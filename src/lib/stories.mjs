import { createHash, randomUUID } from "node:crypto";
import { openDatabase } from "./inquiries.mjs";

export function openJournal(directory = process.env.OMI_DATA_DIR || ".private") {
  const db = openDatabase(directory);
  db.exec(`PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS guest_stories (
      id TEXT PRIMARY KEY, request_key TEXT NOT NULL UNIQUE, digest TEXT NOT NULL,
      title TEXT NOT NULL, byline TEXT NOT NULL, body TEXT NOT NULL, service TEXT NOT NULL,
      state TEXT NOT NULL DEFAULT 'pending', created TEXT NOT NULL, published TEXT
    );
    CREATE INDEX IF NOT EXISTS guest_stories_state ON guest_stories(state,published);
    CREATE TABLE IF NOT EXISTS guest_photos (
      story TEXT NOT NULL REFERENCES guest_stories(id), position INTEGER NOT NULL,
      caption TEXT NOT NULL, image BLOB NOT NULL, PRIMARY KEY(story,position)
    );`);
  return db;
}

export function readStoryFields(form) {
  function field(key, max, required = false) {
    const value = form.get(key) ?? "";
    if (typeof value !== "string" || value.length > max || (required && !value.trim()))
      throw Error("Please check the story title, name and text lengths.");
    return value.trim();
  }
  if (form.get("permission") !== "yes")
    throw Error("Confirm permission to publish your story and photographs.");
  return { title: field("title", 120, true), byline: field("byline", 80) || "Guest traveler",
    body: field("body", 6000, true), service: field("service", 2000) };
}

export function saveStory(db, key, story, photos) {
  const hash = createHash("sha256").update(JSON.stringify(story));
  for (const photo of photos) hash.update(JSON.stringify(photo.caption)).update(createHash("sha256").update(photo.image).digest());
  const digest = hash.digest("hex");
  db.exec("BEGIN IMMEDIATE");
  try {
    const existing = db.prepare("SELECT id,digest FROM guest_stories WHERE request_key=?").get(key);
    if (existing && existing.digest !== digest) throw Error("CHANGED");
    let id = existing?.id;
    if (!existing) {
      if (db.prepare("SELECT count(*) AS n FROM guest_stories WHERE state='pending'").get().n >= 250)
        throw Error("QUEUE_FULL");
      id = randomUUID();
      db.prepare("INSERT INTO guest_stories(id,request_key,digest,title,byline,body,service,created) VALUES(?,?,?,?,?,?,?,?)")
        .run(id,key,digest,story.title,story.byline,story.body,story.service,new Date().toISOString());
      const insert = db.prepare("INSERT INTO guest_photos(story,position,caption,image) VALUES(?,?,?,?)");
      photos.forEach((photo, i) => insert.run(id,i,photo.caption,photo.image));
    }
    db.exec("COMMIT");
    return id;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

/** @returns {{id:string,title:string,byline:string,excerpt:string,published:string,photos:number}[]} */
export function publishedStories(db, limit, offset) {
  return db.prepare(`SELECT id,title,byline,substr(body,1,180) AS excerpt,published,
    (SELECT count(*) FROM guest_photos WHERE story=id) AS photos
    FROM guest_stories WHERE state='published' ORDER BY published DESC,id DESC LIMIT ? OFFSET ?`).all(limit,offset);
}
/** @returns {{id:string,title:string,byline:string,body:string,service:string,published:string,photos:{position:number,caption:string}[]}|null} */
export function publishedStory(db, id) {
  const entry = db.prepare("SELECT id,title,byline,body,service,published FROM guest_stories WHERE id=? AND state='published'").get(id);
  if (!entry) return null;
  return { ...entry, photos: db.prepare("SELECT position,caption FROM guest_photos WHERE story=? ORDER BY position").all(id) };
}
export function publishedPhoto(db, id, position) {
  return db.prepare(`SELECT image FROM guest_photos JOIN guest_stories ON story=id
    WHERE id=? AND position=? AND state='published'`).get(id,position)?.image;
}
export function moderateStory(db, id, state) {
  if (!["published","declined","pending"].includes(state)) throw Error("Choose published, declined or pending.");
  const result = db.prepare(`UPDATE guest_stories SET state=?, published=CASE WHEN ?='published'
    THEN COALESCE(published,?) ELSE NULL END WHERE id=?`).run(state,state,new Date().toISOString(),id);
  if (!result.changes) throw Error("Story not found.");
}
