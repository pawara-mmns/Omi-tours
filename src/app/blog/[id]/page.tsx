import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { openJournal, publishedStory } from "@/lib/stories.mjs";
export const dynamic = "force-dynamic";
export const metadata = {title:"A guest’s travel story"};
export default async function Entry({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const db = openJournal();
  let story;
  try { story = publishedStory(db,id); } finally { db.close(); }
  if (!story) notFound();
  return <main id="main" className="wrap guest-entry">
    <Link href="/blog" className="textlink"><ArrowLeft size={15}/> Guest journal</Link>
    <article>
      <header><p className="kicker"><span />Traveler’s story</p><h1>{String(story.title)}</h1>
        <p className="guest-byline">By {String(story.byline)} · {new Intl.DateTimeFormat("en-GB",{dateStyle:"long",timeZone:"Asia/Colombo"}).format(new Date(String(story.published)))}</p>
      </header>
      <p className="guest-prose">{String(story.body)}</p>
      {story.photos.length > 0 && <div className="guest-prints">
        {story.photos.map((photo,i) => <figure key={i}>
          <img loading="lazy" src={`/api/stories/${id}/photos/${photo.position}`} alt={String(photo.caption) || `Tour photograph ${i+1} shared by ${story.byline}`} />
          {photo.caption ? <figcaption>{String(photo.caption)}</figcaption> : null}
        </figure>)}
      </div>}
      {story.service ? <section className="guest-service"><h2>Traveling with OMI</h2><p className="guest-prose">{String(story.service)}</p></section> : null}
    </article>
  </main>;
}
