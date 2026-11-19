import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { packages, islandJourneyId } from "@/data/packages.mjs";
import "./private-packages.css";

export function PrivatePackages() {
  return (
    <section className="wrap private-packages" id="packages" aria-labelledby="packages-heading">
      <header className="packages-heading">
        <div>
          <p className="kicker"><span />Private tours</p>
          <h2 id="packages-heading">Tailor-made <em>packages</em></h2>
        </div>
        <p>Start with a route that catches your eye. Your destinations, dates, group size, stays and activities shape your private quote.</p>
      </header>
      <div className="packages-grid">
        {packages.map((tour) => (
          <article key={tour.id} className="package-card">
            <div className="package-face">
              <p className="package-kind">{tour.kind}</p>
              <img loading="lazy" src={`/images/destinations/${tour.sketch}.webp`} alt="" width="366" height="247" />
              <p className="package-length">{tour.days} days · {tour.days - 1} nights</p>
              <h3>{tour.title}</h3>
              <p className="package-route">{tour.route}</p>
            </div>
            <div className="package-details">
              <p>{tour.description}</p>
              {tour.id === islandJourneyId && <Link className="package-itinerary" href="/journey">View day-by-day itinerary <ArrowUpRight size={15} /></Link>}
            </div>
            <div className="package-stub">
              <Link className="textlink" href={`/plan?package=${tour.id}`} aria-label={`Request a quote for ${tour.title}`}>Request a quote <ArrowRight size={16} /></Link>
            </div>
          </article>
        ))}
      </div>
      <p className="package-custom">Have other places in mind? <Link className="textlink" href="/plan">Plan your own route <ArrowUpRight size={16} /></Link></p>
    </section>
  );
}
