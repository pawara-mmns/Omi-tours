import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DestinationGuide } from "@/components/DestinationGuide";
import { Hero } from "@/components/Hero";
import { ExperienceSection } from "@/components/Experiences";
import { PhotoAlbum } from "@/components/PhotoAlbum";
import { PeraheraFrieze } from "@/components/PeraheraFrieze";
import { PrivatePackages } from "@/components/PrivatePackages";
import { JourneyAtlas } from "@/components/JourneyAtlas";
export default function Home() {
  return (
    <main id="main" className="journal-home">
      <Hero />
      <DestinationGuide />
      <ExperienceSection />
      <JourneyAtlas />
      <PhotoAlbum />
      <PeraheraFrieze />
      <PrivatePackages />
      <section className="wrap home-guest-journal" aria-labelledby="guest-journal-title">
        <img src="/images/destinations/negombo.webp" alt="" width="366" height="247" loading="lazy" />
        <div><p className="kicker"><span />Travelers’ stories</p>
          <h2 id="guest-journal-title">The guest <em>journal</em></h2>
          <p>Traveled with OMI? Share a memory from your tour, a photograph, or a few words about the service.</p>
          <div className="actions"><Link className="btn dark" href="/blog">Open the journal <ArrowRight size={16}/></Link>
            <Link className="textlink" href="/blog/share">Share your story</Link></div>
        </div>
      </section>
    </main>
  );
}
