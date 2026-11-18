import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import journey from "@/data/journey.json";

const sketches = [
  "palms",
  "elephant",
  "rock",
  "pavilion",
  "tea",
  "railway",
  "railway",
  "wetland",
  "elephant",
  "palms",
];

export function JournalRoute() {
  return (
    <section className="journal-route" aria-labelledby="sample-title">
      <p className="route-eyebrow">Suggested itinerary</p>
      <div className="route-intro">
        <h2 id="sample-title">
          <Link href="/journey">Sri Lanka in {journey.days.length} Days</Link>
        </h2>
        <p>
          Nine nights from Negombo to the south coast, with room to make the
          journey your own.
        </p>
        <Link className="textlink" href="/journey">
          Full itinerary <ArrowUpRight size={15} />
        </Link>
      </div>
      <ol className="route-stops">
        {journey.days.map((day, i) => (
          <li key={day.id}>
            <Link
              href={`/journey?day=${day.id}`}
              aria-label={`Day ${day.id}: ${day.route}`}
            >
              <img
                width="140"
                height="80"
                alt=""
                src={`/images/journal/${sketches[i]}.webp`}
              />
              <span className="route-node" aria-hidden="true" />
              <span className="stop-day">Day {day.id}</span>
              <span className="stop-place">{day.place}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
