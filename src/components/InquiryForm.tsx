"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import journey from "@/data/journey.json";
import { experiences } from "@/data/experiences";
import { islandJourneyId, type packages } from "@/data/packages.mjs";
import { usePreferences } from "@/lib/preferences";

export function InquiryForm({ interest, tour }: { interest: string; tour?: (typeof packages)[number] }) {
  const { prefs, update, ready } = usePreferences();
  const useJourneyEdits = !tour || tour.id === islandJourneyId;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState("");
  const key = useRef("");
  const prev = useRef("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const text = (name: string) => String(form.get(name) || "");
    const payload = JSON.stringify({
      name: text("name"),
      email: text("email"),
      date: text("date"),
      accommodation: text("accommodation"),
      travelers: Number(text("travelers")),
      duration: Number(text("duration")),
      interests: form.getAll("interests"),
      notes: text("notes"),
      consent: form.has("consent"),
      ...(useJourneyEdits ? prefs : { coast: "", edits: {} }),
      packageId: tour?.id,
      destinations: text("destinations"),
    });
    try {
      if (!key.current || prev.current !== payload) {
        key.current = crypto.randomUUID();
        prev.current = payload;
      }
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key.current,
        },
        body: payload,
      });
      const body = await res.json();
      if (!res.ok) throw Error(body.error || "Please try again.");
      setReceipt(body.reference);
      requestAnimationFrame(() => document.getElementById("receipt")?.focus());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  if (receipt)
    return (
      <div className="receipt" id="receipt" tabIndex={-1}>
        <Check size={32} />
        <h2>Inquiry received.</h2>
        <p>
          Your trip preferences have been saved for OMI to review. Keep your
          reference <strong>{receipt}</strong>.
        </p>
        <p>
          Pricing, availability and the final route need confirmation before
          booking.
        </p>
        <Link className="textlink" href="/journey">
          Back to the journey <ArrowRight size={16} />
        </Link>
      </div>
    );
  return (
    <form className="inquiry" onSubmit={submit}>
      <h2>Your travel details</h2>
      {tour && <p className="quote-package">Your starting route · <strong>{tour.title}</strong></p>}
      <p className="hint">Fields marked * are required.</p>
      <div className="fieldgrid">
        <label>
          Your name *
          <input name="name" autoComplete="name" maxLength={100} required />
        </label>
        <label>
          Email address *
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
          />
        </label>
        <label>
          Preferred arrival
          <input type="date" name="date" />
        </label>
        <label>
          Travelers *
          <input
            type="number"
            min={1}
            max={100}
            step={1}
            name="travelers"
            defaultValue={2}
            required
          />
        </label>
        <label>
          Trip length in days *
          <input
            name="duration"
            type="number"
            min={1}
            max={180}
            step={1}
            defaultValue={tour?.days ?? 10}
            required
          />
        </label>
        {useJourneyEdits && <label>
          Beach drop-off
          <select
            value={prefs.coast}
            onChange={(e) => update({ ...prefs, coast: e.target.value })}
            disabled={!ready}
          >
            <option value="">Decide with OMI</option>
            {journey.coasts.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
        </label>}
      </div>
      <label>
        Destinations you’d like to visit
        <input name="destinations" maxLength={300} defaultValue={tour?.route} placeholder="Towns, regions or stops you have in mind" />
      </label>
      <fieldset>
        <legend>What draws you to Sri Lanka?</legend>
        <div className="checkgrid">
          {experiences.map((x) => (
            <label className="check" key={x.slug}>
              <input
                type="checkbox"
                name="interests"
                value={x.slug}
                defaultChecked={interest === x.slug || tour?.interests.includes(x.slug)}
              />
              {x.theme}
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        Accommodation preferences
        <input
          name="accommodation"
          maxLength={160}
          placeholder="Hotel style, meal plan or room needs"
        />
      </label>
      {useJourneyEdits && Object.values(prefs.edits).some((v) => v.trim()) && (
        <div className="edits">
          <h3>Your itinerary changes</h3>
          {Object.entries(prefs.edits)
            .filter(([, v]) => v.trim())
            .map(([day, v]) => (
              <p key={day}>
                <b>Day {day}</b> · {v}
              </p>
            ))}
          <Link className="textlink" href="/journey">
            Edit daily preferences
          </Link>
        </div>
      )}
      <label>
        {tour ? "Which inclusions or route changes would you like?" : "Anything else to include?"}
        <textarea
          name="notes"
          rows={3}
          maxLength={2000}
          placeholder={tour ? "For example, include entrance fees, add a hotel night or skip a stop." : "Tell us about your pace, budget or places you’d love to see."}
        />
      </label>
      <label className="check consent">
        <input name="consent" type="checkbox" required />I agree that OMI TOURS
        may store these details and contact me about this trip. *
      </label>
      {error && <p role="alert">{error}</p>}
      <button className="btn dark" type="submit" disabled={!ready || busy}>
        {busy ? "Saving inquiry…" : "Request my quote"} <ArrowRight size={17} />
      </button>
    </form>
  );
}
