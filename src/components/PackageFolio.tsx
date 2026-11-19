import Link from "next/link";
import { ArrowLeft, ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { album } from "@/data/gallery";
import { islandJourneyId, type packages } from "@/data/packages.mjs";
import "./package-folio.css";

type Tour = (typeof packages)[number];
const photographs = new Map(album.flatMap((chapter) =>
  chapter.photos.map((photo) => [photo.image, photo] as const)
));

export function PackageFolio({ tour }: { tour: Tour }) {
  return (
    <article className="package-folio" aria-labelledby="folio-title">
      <Link className="textlink folio-back" href="/#packages"><ArrowLeft size={15} /> All packages</Link>
      <header className="folio-heading">
        <div>
          <p className="kicker"><span />{tour.kind} · {tour.days} days / {tour.days - 1} nights</p>
          <h1 id="folio-title">{tour.title}</h1>
          <p className="folio-route">{tour.route}</p>
        </div>
        <a className="btn dark" href="#inquiry">Request a private quote <ArrowDown size={16} /></a>
      </header>
      <div className="folio-spread">
        <div className="folio-plates" aria-label="Route photographs" role="group">
          {tour.photos.map((image) => {
            const photo = photographs.get(image);
            if (!photo) throw new Error(`Missing route photograph: ${image}`);
            return (
              <figure key={image} className="folio-print">
                <img src={`/images/${photo.image}.webp`} alt={photo.alt} width={560} height={480} />
                <figcaption>{photo.place}</figcaption>
              </figure>
            );
          })}
          <img className="folio-engraving" src={`/images/destinations/${tour.sketch}.webp`} alt="" width={366} height={247} />
        </div>
        <section className="folio-inclusions">
          <h2>Suggested <em>inclusions</em></h2>
          <p>Your personal quote will specify which services and entrance fees are covered for your dates.</p>
          <ul>
            {tour.inclusions.map(([title, description]) => (
              <li key={title}>
                <Check aria-hidden="true" size={17} />
                <div><h3>{title}</h3><p>{description}</p></div>
              </li>
            ))}
          </ul>
          {tour.id === islandJourneyId && <Link className="textlink" href="/journey">Explore the day-by-day itinerary <ArrowUpRight size={15} /></Link>}
        </section>
      </div>
      <aside className="folio-terms" aria-labelledby="terms-title">
        <h2 id="terms-title">What to confirm <em>in your quote</em></h2>
        <dl>
          {tour.quoteNotes.map(([title, description]) => (
            <div key={title}><dt>{title}</dt><dd>{description}</dd></div>
          ))}
        </dl>
      </aside>
    </article>
  );
}
