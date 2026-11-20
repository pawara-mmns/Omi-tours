import {
  readFileSync,
  writeFileSync,
  renameSync,
  mkdirSync,
  unlinkSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { randomUUID, createHash } from "node:crypto";
import { openDatabase } from "../src/lib/inquiries.mjs";
import { journalAdmin } from "./journal-admin.mjs";

const source = "src/data/journey.json";
const dataDir = resolve(process.env.OMI_DATA_DIR || ".private");
const hash = (text) => createHash("sha256").update(text).digest("hex");
const [action, argument, value] = process.argv.slice(2);
function run() {
  if (!action || action === "help") {
    console.log("Guest journal\n  stories\n  story-review ID\n  story-status ID published|declined|pending\n");
    console.log(
      "OMI owner tools\n  inquiries\n  show REFERENCE\n  status REFERENCE new|in-review|quoted|closed\n  draft FILE.json\n  apply FILE.json\n\nDrafts allow edits to the journey title, introduction, day headings and descriptions. Apply saves a backup. Rebuild and restart the website to publish.",
    );
    return;
  }
  if (["stories","story-review","story-status"].includes(action)) {
    journalAdmin(dataDir,action,argument,value);
    return;
  }
  if (action === "draft") {
    if (!argument) throw Error("Choose a new filename for your draft.");
    const raw = readFileSync(source, "utf8"),
      j = JSON.parse(raw);
    const draft = {
      base: hash(raw),
      title: j.title,
      intro: j.intro,
      days: j.days.map(({ id, title, description }) => ({
        id,
        title,
        description,
      })),
    };
    writeFileSync(argument, JSON.stringify(draft, null, 2) + "\n", {
      flag: "wx",
    });
    console.log("Draft written. Edit it and use apply to validate and save.");
    return;
  }
  if (action === "apply") {
    if (!argument) throw Error("Supply a draft file.");
    const draft = JSON.parse(readFileSync(argument, "utf8"));
    mkdirSync(dataDir, { recursive: true });
    const lock = join(dataDir, "package-edit.lock");
    writeFileSync(lock, new Date().toISOString(), { flag: "wx" });
    try {
      const raw = readFileSync(source, "utf8"),
        j = JSON.parse(raw);
      if (draft.base !== hash(raw))
        throw Error(
          "The package has changed. Export a fresh draft and reapply the edits.",
        );
      function copy(value, max) {
        if (typeof value !== "string" || !value.trim() || value.length > max)
          throw Error("An edited field is empty or too long.");
        return value.trim();
      }
      j.title = copy(draft.title, 100);
      j.intro = copy(draft.intro, 450);
      if (!Array.isArray(draft.days) || draft.days.length !== j.days.length)
        throw Error("Keep all ten sample days.");
      j.days = j.days.map((d, i) => {
        const edit = draft.days[i];
        if (edit?.id !== d.id) throw Error("Keep the original day numbers.");
        return {
          ...d,
          title: copy(edit.title, 120),
          description: copy(edit.description, 2000),
        };
      });
      const version = randomUUID();
      writeFileSync(join(dataDir, "journey-" + version + ".json"), raw, {
        flag: "wx",
      });
      const temp = source + "." + version + ".tmp";
      writeFileSync(temp, JSON.stringify(j, null, 2) + "\n", { flag: "wx" });
      renameSync(temp, source);
      console.log(
        "Package saved and previous version backed up. Run npm run build and restart the site to publish.",
      );
    } finally {
      unlinkSync(lock);
    }
    return;
  }
  if (!["inquiries", "show", "status"].includes(action))
    throw Error("Unknown command. Run npm run admin for help.");
  const db = openDatabase(dataDir);
  try {
    if (action === "inquiries") {
      console.table(
        db
          .prepare(
            "SELECT reference,created_at,status FROM inquiries ORDER BY created_at DESC",
          )
          .all(),
      );
      return;
    }
    if (!argument) throw Error("Supply an inquiry reference.");
    if (action === "show") {
      const row = db
        .prepare(
          "SELECT reference,created_at,status,payload FROM inquiries WHERE reference=?",
        )
        .get(argument);
      if (!row) throw Error("Reference not found.");
      console.log(
        JSON.stringify({ ...row, payload: JSON.parse(row.payload) }, null, 2),
      );
      return;
    }
    if (!["new", "in-review", "quoted", "closed"].includes(value))
      throw Error("Unknown status.");
    const result = db
      .prepare("UPDATE inquiries SET status=? WHERE reference=?")
      .run(value, argument);
    if (!result.changes) throw Error("Reference not found.");
    console.log("Status updated.");
  } finally {
    db.close();
  }
}
try {
  run();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
