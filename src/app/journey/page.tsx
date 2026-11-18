import journey from "@/data/journey.json";
import { Journey } from "@/components/Journey";
export const dynamic = "force-dynamic";
export const metadata = { title: "The ten-day Sri Lanka journey" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  const day = Number((await searchParams).day);
  return (
    <main id="main" className="wrap inner">
      <p className="kicker">
        <span />
        Customizable sample itinerary
      </p>
      <h1>{journey.title}</h1>
      <p className="lead">{journey.intro}</p>
      <div className="metarow">
        <span>
          {journey.days.filter((d) => d.overnight).length} nights /{" "}
          {journey.days.length} days
        </span>
        <span>Private quote on request</span>
      </div>
      <Journey
        initialDay={Number.isInteger(day) && day >= 1 && day <= 10 ? day : 1}
      />
    </main>
  );
}
