import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { experiences, type Experience } from "@/data/experiences";
export function ExperienceCard({ item }: { item: Experience }) {
  return (
    <Link className="experience" href={"/experiences/" + item.slug}>
      <div className="cardphoto">
        <img
          loading="lazy"
          src={"/images/" + item.image + ".webp"}
          alt={item.alt}
          width="600"
          height="400"
        />
        <span className="cardarrow">
          <ArrowUpRight size={17} />
        </span>
      </div>
      <p className="micro">{item.region}</p>
      <h3>{item.title}</h3>
    </Link>
  );
}
export function ExperienceSection() {
  return (
    <section className="wrap section" id="experiences">
      <div className="sectiontitle">
        <div>
          <p className="kicker">
            <span />
            Discover Sri Lanka
          </p>
          <h2>
            Island <em>experiences</em>
          </h2>
        </div>
        <Link className="textlink" href="/experiences">
          All experiences <ArrowRight size={16} />
        </Link>
      </div>
      <div className="cardgrid">
        {experiences.slice(0, 3).map((x) => (
          <ExperienceCard key={x.slug} item={x} />
        ))}
      </div>
    </section>
  );
}
