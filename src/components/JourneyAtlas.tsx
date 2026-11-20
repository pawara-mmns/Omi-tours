"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Compass } from "lucide-react";
import journey from "@/data/journey.json";
import { album } from "@/data/gallery";
import { RouteMap } from "./RouteMap";
import { HangingCharms } from "./HangingCharms";
import "./journey-atlas.css";

const stops = album.flatMap(chapter => chapter.photos)
  .filter(photo => [3, 7, 8].includes(photo.day))
  .sort((a, b) => a.day - b.day);

export function JourneyAtlas() {
  const [selected, setSelected] = useState(stops[0]);
  const titleBreak = journey.title.lastIndexOf(" ", journey.title.lastIndexOf(" ") - 1);
  return (
    <section id="sample-journey" className="journey-atlas" aria-labelledby="atlas-title">
      <HangingCharms />
      <div className="atlas-sheet wrap">
        <div className="atlas-copy">
          <p className="atlas-eyebrow"><Compass size={19} aria-hidden="true" /> The sample journey</p>
          <h2 id="atlas-title">{titleBreak > 0 ? <>{journey.title.slice(0, titleBreak)} <em>{journey.title.slice(titleBreak + 1)}</em></> : journey.title}</h2>
          <p className="atlas-duration">{journey.days.length - 1} nights <span aria-hidden="true">/</span> {journey.days.length} days</p>
          <p className="atlas-intro">{journey.intro}</p>
          <Link className="btn cream atlas-cta" href="/journey">Open the itinerary <ArrowRight size={17} /></Link>
        </div>
        <div className="atlas-cartography">
          <div className="atlas-mount" id="atlas-plate">
            <figure>
              <img key={selected.image} src={`/images/${selected.image}.webp`} alt={selected.alt} width="510" height="440" loading="lazy" />
              <figcaption aria-live="polite"><span>Day {selected.day}</span> {selected.caption}</figcaption>
            </figure>
          </div>
          <div className="atlas-map" id="atlas-route"><RouteMap day={selected.day} coast="" /></div>
          <div className="atlas-stops" role="group" aria-label="Preview a journey stop">
            <span className="atlas-stops-label">Preview a stop</span>
            <div>{stops.map(stop => (
              <button key={stop.day} type="button" aria-pressed={stop.day === selected.day}
                aria-controls="atlas-plate atlas-route" onClick={() => setSelected(stop)}>
                {journey.days.find(d => d.id === stop.day)?.place || stop.place}
              </button>
            ))}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
