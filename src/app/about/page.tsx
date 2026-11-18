import Link from "next/link";
import { ArrowRight } from "lucide-react";
export const metadata = { title: "About OMI TOURS" };
export default function About() {
  return (
    <main id="main" className="wrap inner readable">
      <p className="kicker">
        <span />
        About OMI Tours
      </p>
      <h1>
        Come as a Tourist,
        <br />
        <em>Go as a Friend.</em>
      </h1>
      <p className="lead">
        OMI TOURS is a Sri Lankan tourism business that adapts its journeys to
        each traveler. Our ten-day sample began as an itinerary prepared for a
        customer.
      </p>
      <h2>A journey you can shape</h2>
      <p>
        Keep the railway through the hills, trade rafting for a gentler day, or
        tell us where you would like more time. The sample is a starting point
        for a conversation.
      </p>
      <h2>What your quote should cover</h2>
      <p>
        Ask for the proposed dates, transport, stays, activities, inclusions,
        exclusions and payment and cancellation terms together. The final price
        depends on your choices. Beach accommodation after the last drop-off
        falls outside the sample’s nine nights.
      </p>
      <h2>About the imagery</h2>
      <p>
        The opening railway scene and field-journal sketches are artistic
        interpretations. Destination photographs and the OMI mark come from the
        original tour agenda.
      </p>
      <Link className="btn dark" href="/plan">
        Request a quote <ArrowRight size={17} />
      </Link>
    </main>
  );
}
