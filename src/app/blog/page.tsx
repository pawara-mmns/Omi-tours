import Link from "next/link";
import { ArrowRight, Feather } from "lucide-react";
import { openJournal, publishedStories } from "@/lib/stories.mjs";
export const dynamic = "force-dynamic";
export const metadata = {title: "Guest travel journal"};

export default async function Blog({searchParams}: {searchParams: Promise<{page?: string}>}) {
  const raw = (await searchParams).page;
  const page = raw && /^\d{1,6}$/.test(raw) ? Math.max(1,Number(raw)) : 1;
  const db = openJournal();
  let stories;
  try { stories = publishedStories(db,13,(page-1)*12); } finally { db.close(); }
  return <main className="wrap guest-journal" id="main">
    <header className="guest-masthead">
      <div>
        <p className="kicker"><span />The Ceylon Field Journal</p>
        <h1>The guest <em>journal</em></h1>
        <p className="lead">Sri Lanka through the eyes of the people who traveled with OMI. Share the places you remember and what it was like to travel with us.</p>
        <Link href="/blog/share" className="btn cream"><Feather size={17}/> Share your story</Link>
      </div>
      <img src="/images/destinations/ella.webp" width="366" height="247" alt="" />
    </header>
    <section className="guest-entries" aria-labelledby="entries-heading">
      <h2 id="entries-heading">Travelers’ stories</h2>
      {stories.length ? <div className="guest-list">
        {stories.slice(0,12).map(s => <article key={String(s.id)}>
          <Link href={`/blog/${s.id}`}>
            {Number(s.photos)>0 && <img src={`/api/stories/${s.id}/photos/0`} alt="" loading="lazy" width="430" height="280" />}
            <div><p className="guest-byline">By {String(s.byline)}</p><h3>{String(s.title)}</h3>
              <p className="guest-excerpt">{String(s.excerpt)}</p></div>
          </Link>
        </article>)}
      </div> : <div className="guest-empty"><Feather aria-hidden="true" size={23}/>
        <p>{page === 1 ? "The guestbook is open. Have you traveled with OMI? Yours could be the first story here." : "There are no stories on this page."}</p></div>}
      <nav className="guest-pages" aria-label="Journal pages">
        {page>1 && <Link href={`/blog?page=${page-1}`} className="textlink">Newer stories</Link>}
        {stories.length>12 && <Link href={`/blog?page=${page+1}`} className="textlink">Older stories <ArrowRight size={15}/></Link>}
      </nav>
    </section>
  </main>;
}
