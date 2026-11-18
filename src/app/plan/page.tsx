import { InquiryForm } from "@/components/InquiryForm";
import { experiences } from "@/data/experiences";
export const dynamic = "force-dynamic";
export const metadata = { title: "Plan my trip" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string }>;
}) {
  const slug = (await searchParams).interest;
  return (
    <main className="wrap inner" id="main">
      <div className="plangrid">
        <div>
          <p className="kicker">
            <span />
            Custom trip inquiry
          </p>
          <h1>
            Plan <em>my trip.</em>
          </h1>
          <p className="lead">
            Tell us how you’d like to travel. Your dates, interests and pace
            help shape a personal itinerary and quote.
          </p>
          <img
            className="planphoto"
            src="/images/ella.webp"
            alt="A view over Ella’s Nine Arch Bridge"
            width="452"
            height="678"
          />
          <p className="hint">
            A quote request carries no payment or booking commitment.
          </p>
        </div>
        <InquiryForm
          interest={experiences.find((x) => x.slug === slug)?.slug || ""}
        />
      </div>
    </main>
  );
}
