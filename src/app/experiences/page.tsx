import { experiences } from "@/data/experiences";
import { ExperienceCard } from "@/components/Experiences";
export const metadata = { title: "Island experiences" };
export default function Page() {
  return (
    <main className="wrap inner" id="main">
      <p className="kicker">
        <span />
        Explore Sri Lanka
      </p>
      <h1>
        Island <em>experiences</em>
      </h1>
      <p className="lead">
        Four ways to shape a journey. Each draws on stops in OMI’s sample
        itinerary and can be discussed in your quote.
      </p>
      <div className="cardgrid collection">
        {experiences.map((x) => (
          <ExperienceCard key={x.slug} item={x} />
        ))}
      </div>
    </main>
  );
}
