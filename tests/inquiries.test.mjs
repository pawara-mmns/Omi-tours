import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  validateInquiry,
  openDatabase,
  storeInquiry,
  coastNames,
} from "../src/lib/inquiries.mjs";
const sample = {
  name: " Test Traveler ",
  email: " TEST@example.com ",
  date: "2027-01-16",
  travelers: 2,
  duration: 10,
  coast: "Weligama",
  interests: ["hill-country"],
  edits: { 5: " Skip rafting " },
  notes: "",
  consent: true,
};
test("normalizes preferences without losing the chosen day or coast", () => {
  const p = validateInquiry(sample);
  assert.equal(p.name, "Test Traveler");
  assert.equal(p.email, "test@example.com");
  assert.equal(p.edits[5], "Skip rafting");
  assert.equal(p.coast, "Weligama");
});
for (const [key, value] of Object.entries({
  name: " ",
  email: "noaddress",
  date: "2027-02-30",
  travelers: 0,
  duration: 1.5,
  coast: "Invalid",
  interests: ["other"],
  edits: { 11: "extra" },
  consent: false,
  notes: "x".repeat(2001),
})) {
  test("rejects invalid " + key, () =>
    assert.throws(() => validateInquiry({ ...sample, [key]: value })),
  );
}
test("same request survives reopening, retries once and protects prior details", () => {
  const dir = mkdtempSync(join(tmpdir(), "omi-test-"));
  let db = openDatabase(dir);
  try {
    const key = randomUUID(),
      p = validateInquiry(sample),
      ref = storeInquiry(db, key, p);
    db.close();
    db = openDatabase(dir);
    assert.equal(storeInquiry(db, key, p), ref);
    assert.equal(db.prepare("SELECT count(*) AS n FROM inquiries").get().n, 1);
    assert.throws(
      () => storeInquiry(db, key, { ...p, travelers: 3 }),
      /REQUEST_CHANGED/,
    );
    assert.equal(
      JSON.parse(db.prepare("SELECT payload FROM inquiries").get().payload)
        .travelers,
      2,
    );
  } finally {
    db.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
test("sample preserves day sequence, overnight allocation and selectable beaches", () => {
  const j = JSON.parse(readFileSync("src/data/journey.json", "utf8"));
  assert.deepEqual(
    j.days.map((x) => x.id),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );
  assert.deepEqual(
    j.days.map((x) => x.overnight),
    [
      "Negombo",
      "Habarana",
      "Habarana",
      "Kandy",
      "Nuwara Eliya",
      "Ella",
      "Ella",
      "Yala",
      "Udawalawe",
      "",
    ],
  );
  assert.deepEqual(
    j.coasts.map((c) => c.name),
    coastNames,
  );
});
