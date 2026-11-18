import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { randomUUID } from "node:crypto";

export const coastNames = [
  "Tangalle",
  "Mirissa",
  "Weligama",
  "Unawatuna",
  "Hikkaduwa",
];
export const interestNames = [
  "hill-country",
  "wild-island",
  "southern-shores",
  "living-heritage",
];
export const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function validateInquiry(input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw Error("Please check the form.");
  function field(key, limit, required = false) {
    const value = input[key] ?? "";
    if (
      typeof value !== "string" ||
      value.length > limit ||
      (required && !value.trim())
    )
      throw Error("Please check " + key + ".");
    return value.trim();
  }
  const name = field("name", 100, true),
    email = field("email", 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw Error("Enter a valid email address.");
  const travelers = input.travelers,
    duration = input.duration;
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > 100)
    throw Error("Choose between 1 and 100 travelers.");
  if (!Number.isInteger(duration) || duration < 1 || duration > 180)
    throw Error("Choose a trip length between 1 and 180 days.");
  const date = field("date", 10);
  if (date) {
    const parsed = new Date(date + "T00:00:00Z");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== date
    )
      throw Error("Enter a valid arrival date.");
  }
  const coast = field("coast", 30);
  if (coast && !coastNames.includes(coast))
    throw Error("Select a beach from the list.");
  if (
    !Array.isArray(input.interests) ||
    input.interests.length > 4 ||
    input.interests.some((x) => !interestNames.includes(x))
  )
    throw Error("Select an interest from the list.");
  if (
    !input.edits ||
    typeof input.edits !== "object" ||
    Array.isArray(input.edits)
  )
    throw Error("Check the daily itinerary changes.");
  const edits = {};
  for (const [k, v] of Object.entries(input.edits)) {
    if (!/^(?:[1-9]|10)$/.test(k) || typeof v !== "string" || v.length > 500)
      throw Error("Check the daily itinerary changes.");
    if (v.trim()) edits[k] = v.trim();
  }
  if (input.consent !== true)
    throw Error("Confirm OMI may use your details for this inquiry.");
  return {
    name,
    email,
    date,
    travelers,
    duration,
    coast,
    interests: [...new Set(input.interests)].sort(),
    edits,
    notes: field("notes", 2000),
    accommodation: field("accommodation", 160),
    consent: true,
  };
}
export function openDatabase(
  directory = process.env.OMI_DATA_DIR || ".private",
) {
  const root = resolve(/* turbopackIgnore: true */ directory);
  mkdirSync(root, { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(join(root, "inquiries.sqlite"));
  db.exec(`PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL;
 CREATE TABLE IF NOT EXISTS inquiries (
 reference TEXT PRIMARY KEY, request_key TEXT UNIQUE NOT NULL,
 created_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', payload TEXT NOT NULL
 );`);
  return db;
}
export function storeInquiry(db, key, request) {
  const payload = JSON.stringify(request);
  const reference = "OMI-" + randomUUID().slice(0, 13).toUpperCase();
  db.prepare(
    "INSERT INTO inquiries(reference,request_key,created_at,payload) VALUES(?,?,?,?) ON CONFLICT(request_key) DO NOTHING",
  ).run(reference, key, new Date().toISOString(), payload);
  const saved = db
    .prepare("SELECT reference,payload FROM inquiries WHERE request_key=?")
    .get(key);
  if (saved.payload !== payload) throw Error("REQUEST_CHANGED");
  return saved.reference;
}
