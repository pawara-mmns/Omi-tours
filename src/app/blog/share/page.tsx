import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GuestStoryForm } from "@/components/GuestStoryForm";
export const metadata = {title:"Share your tour story"};
export default function Share() {
  return <main className="wrap guest-share" id="main">
    <Link href="/blog" className="textlink"><ArrowLeft size={15}/> Guest journal</Link>
    <div className="guest-share-grid">
      <header><p className="kicker"><span />Guest journal</p><h1>Share your <em>story.</em></h1>
        <p className="lead">Tell us about your tour in your own words. Add a few photographs and a note about OMI’s service, if you like.</p>
        <p className="hint">No account needed. OMI reviews entries before they appear in the journal.</p>
        <img src="/images/destinations/negombo.webp" width="366" height="247" alt="" />
      </header>
      <GuestStoryForm />
    </div>
  </main>;
}
