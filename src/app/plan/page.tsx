import { InquiryForm } from "@/components/InquiryForm";
import { PackageFolio } from "@/components/PackageFolio";
import { experiences } from "@/data/experiences";
import { packages } from "@/data/packages.mjs";
import Link from "next/link";
export const dynamic = "force-dynamic";
type PlanParams = { searchParams: Promise<{ interest?: string; package?: string }> };
export async function generateMetadata({ searchParams }: PlanParams) {
  const params = await searchParams;
  return { title: packages.find((item) => item.id === params.package)?.title || "Plan my trip" };
}
export default async function Page({
  searchParams,
}: PlanParams) {
  const params = await searchParams;
  const tour = packages.find((item) => item.id === params.package);
  return (
    <main className={tour ? "wrap folio-page" : "wrap inner"} id="main">
      {tour && <PackageFolio tour={tour} />}
      <div className="plangrid" id="inquiry">
        <div>
          <p className="kicker">
            <span />
            Custom trip inquiry
          </p>
          {tour ? <h2>Make this journey <em>yours.</em></h2> : <h1>
            Plan <em>my trip.</em>
          </h1>}
          <p className="lead">
            Tell us how you’d like to travel. Your dates, interests and pace
            help shape a personal itinerary and quote.
          </p>
          {tour ? <Link className="textlink" href="/#packages">Compare private routes</Link> : <img
            className="planphoto"
            src="/images/ella.webp"
            alt="A view over Ella’s Nine Arch Bridge"
            width="452"
            height="678"
          />}
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
