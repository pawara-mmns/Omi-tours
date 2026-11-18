import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JournalRoute } from "@/components/JournalRoute";
import { Hero } from "@/components/Hero";
import { ExperienceSection } from "@/components/Experiences";
import { PhotoAlbum } from "@/components/PhotoAlbum";
import journey from "@/data/journey.json";
export default function Home() {
  return (
    <main id="main" className="journal-home">
      <Hero />
      <JournalRoute />
      <ExperienceSection />
      <section className="feature">
        <div className="wrap featuregrid">
          <img
            loading="lazy"
            width="550"
            height="540"
            src="/images/pidurangala.webp"
            alt="A traveler looking across the forest toward Sigiriya"
          />
          <div>
            <p className="kicker light">
              <span />
              The sample journey
            </p>
            <h2>{journey.title}</h2>
            <p className="featuremeta">9 nights &nbsp; / &nbsp; 10 days</p>
            <p>
              {journey.intro} Explore each day, choose a beach drop-off and tell
              us where you’d like to linger.
            </p>
            <Link className="btn cream" href="/journey">
              Open the itinerary <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <PhotoAlbum />
      <section className="wrap invitation">
        <p className="kicker">
          <span />
          Tailor-made travel
        </p>
        <h2>
          Where would you <em>linger?</em>
        </h2>
        <p>
          A second morning in the hills, a slower road to Kandy, a beach of your
          own choosing. Tell us what matters to you.
        </p>
        <Link className="btn dark" href="/plan">
          Plan my trip <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
