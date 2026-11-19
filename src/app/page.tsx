import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DestinationGuide } from "@/components/DestinationGuide";
import { Hero } from "@/components/Hero";
import { ExperienceSection } from "@/components/Experiences";
import { PhotoAlbum } from "@/components/PhotoAlbum";
import { PeraheraFrieze } from "@/components/PeraheraFrieze";
import { PrivatePackages } from "@/components/PrivatePackages";
import journey from "@/data/journey.json";
export default function Home() {
  return (
    <main id="main" className="journal-home">
      <Hero />
      <DestinationGuide />
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
      <PeraheraFrieze />
      <PrivatePackages />
    </main>
  );
}
