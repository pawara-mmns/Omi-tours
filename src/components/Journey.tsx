"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, MapPin, Moon } from "lucide-react";
import journey from "@/data/journey.json";
import { islandJourneyId } from "@/data/packages.mjs";
import { usePreferences } from "@/lib/preferences";
import { RouteMap } from "./RouteMap";
export function Journey({ initialDay }: { initialDay: number }) {
  const [day, setDay] = useState(initialDay);
  const { prefs, update, ready } = usePreferences();
  const edited = Object.values(prefs.edits).filter((x) => x.trim()).length;
  return (
    <div className="journeygrid">
      <aside>
        <RouteMap day={day} coast={prefs.coast} />
        <p className="mapnote">
          <MapPin size={15} /> Katunayake Airport to the south coast
        </p>
      </aside>
      <div>
        <h2 className="timeline-title">
          Day by <em>day</em>
        </h2>
        <p className="hint">Open a day to explore it or request a change.</p>
        <div className="timeline">
          {journey.days.map((d) => (
            <section className="day" key={d.id}>
              <h3>
                <button
                  aria-expanded={day === d.id}
                  aria-controls={"day-" + d.id}
                  onClick={() => setDay(day === d.id ? 0 : d.id)}
                >
                  <span className="daynumber">
                    DAY {String(d.id).padStart(2, "0")}
                  </span>
                  <span>{d.route}</span>
                  <ChevronDown
                    className={day === d.id ? "rotate" : ""}
                    size={18}
                  />
                </button>
              </h3>
              <div id={"day-" + d.id} hidden={day !== d.id} className="daybody">
                <h4>{d.title}</h4>
                <p>{d.description}</p>
                {d.overnight && (
                  <p className="night">
                    <Moon size={15} /> Overnight in {d.overnight}
                  </p>
                )}
                <label>
                  What would you change?
                  <textarea
                    disabled={!ready}
                    rows={2}
                    value={prefs.edits[d.id] || ""}
                    maxLength={500}
                    placeholder="For example, spend more time here…"
                    onChange={(e) =>
                      update({
                        ...prefs,
                        edits: { ...prefs.edits, [d.id]: e.target.value },
                      })
                    }
                  />
                </label>
              </div>
            </section>
          ))}
        </div>
        <div className="coastbox">
          <h3>Your beach drop-off</h3>
          <label>
            Choose a destination
            <select
              disabled={!ready}
              value={prefs.coast}
              onChange={(e) => update({ ...prefs, coast: e.target.value })}
            >
              <option value="">Decide with OMI</option>
              {journey.coasts.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
          {prefs.coast && (
            <p>
              {journey.coasts.find((c) => c.name === prefs.coast)?.interest}.
              The agenda estimates about{" "}
              {journey.coasts.find((c) => c.name === prefs.coast)?.airport} from
              here to the airport.
            </p>
          )}
          <p>
            Beach stays after drop-off are outside the nine-night itinerary.
          </p>
        </div>
        <p className="hint" aria-live="polite">
          {edited
            ? edited +
              " day change" +
              (edited === 1 ? "" : "s") +
              " added to your quote request."
            : "Your choices carry through to the quote request."}
        </p>
        <Link className="btn dark" href={`/plan?package=${islandJourneyId}`}>
          Request a quote <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
