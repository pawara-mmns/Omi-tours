import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JournalSlideshow } from "./JournalSlideshow";

export function Hero() {
  return (
    <section className="journal-hero" aria-labelledby="journal-title">
      <div className="journal-intro">
        <p className="journal-edition">The Ceylon Field Journal</p>
        <h1 id="journal-title">
          A slower journey
          <br />
          <em>through</em> Sri Lanka
        </h1>
        <p className="journal-deck">
          Railways, forests, tea hills and coastal towns. A journey shaped
          around the places you’d like to explore at your own pace.
        </p>
        <Link href="/plan" className="btn dark journal-cta">
          Plan my trip <ArrowRight size={20} />
        </Link>
        <img
          className="journal-flower"
          src="/images/journal/tea-flower.webp"
          width="238"
          height="287"
          alt=""
        />
      </div>
      <JournalSlideshow />
    </section>
  );
}
