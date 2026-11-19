import { InquiryForm } from "@/components/InquiryForm";
import { experiences } from "@/data/experiences";
import { packages } from "@/data/packages.mjs";
export const dynamic = "force-dynamic";
export const metadata = { title: "Plan my trip" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string; package?: string }>;
}) {
  const params = await searchParams;
  const tour = packages.find((item) => item.id === params.package);
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
          key={tour?.id || params.interest || "custom"}
          tour={tour}
          interest={experiences.find((x) => x.slug === params.interest)?.slug || ""}
        />
      </div>
    </main>
  );
}
