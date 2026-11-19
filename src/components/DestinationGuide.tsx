"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { destinations } from "@/data/destinations";

export function DestinationGuide() {
  const [selected, setSelected] = useState<string | null>(null);
  const place = destinations.find((item) => item.image === selected);

  return (
    <section
      id="destinations"
      className="journal-route"
      aria-labelledby="destination-title"
    >
      <p className="route-eyebrow">The island guide</p>
      <div className="route-intro">
        <h2 id="destination-title">Ten places to discover</h2>
        <p>
          From the ramparts of Galle to the tea hills of Nuwara Eliya. Select a
          sketch to explore.
        </p>
        <Link className="textlink" href="/plan">
          Plan my trip <ArrowUpRight size={15} />
        </Link>
      </div>
      <ul className="route-stops">
        {destinations.map((item) => (
          <li key={item.image}>
            <button
              type="button"
              aria-expanded={selected === item.image}
              aria-controls="destination-note"
              onClick={() =>
                setSelected((current) =>
                  current === item.image ? null : item.image,
                )
              }
            >
              <img
                width="366"
                height="247"
                loading="lazy"
                src={`/images/destinations/${item.image}.webp`}
                alt=""
              />
              <span className="route-node" aria-hidden="true" />
              <span className="destination-motif">{item.subject}</span>
              <span className="stop-place">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <div id="destination-note" className="destination-note" hidden={!place}>
        {place && (
          <>
            <h3>{place.name}</h3>
            <p>{place.note}</p>
          </>
        )}
      </div>
    </section>
  );
}
