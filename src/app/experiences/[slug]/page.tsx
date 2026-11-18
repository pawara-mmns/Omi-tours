import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { experiences } from "@/data/experiences";
export const generateStaticParams = () =>
  experiences.map((x) => ({ slug: x.slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: experiences.find((x) => x.slug === slug)?.title };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const x = experiences.find((x) => x.slug === slug);
  if (!x) notFound();
  return (
    <main id="main" className="wrap inner">
      <Link className="textlink back" href="/experiences">
        <ArrowLeft size={15} /> All experiences
      </Link>
      <div className="detailgrid">
        <div>
          <p className="kicker">
            <span />
            {x.region}
          </p>
          <h1>{x.title}</h1>
          <p className="lead">{x.story}</p>
          <p>{x.suggestion}</p>
          <div className="actions">
            <Link className="btn dark" href={"/plan?interest=" + x.slug}>
              Request a quote <ArrowRight size={16} />
            </Link>
            <Link className="textlink" href={"/journey?day=" + x.day}>
              See the sample day
            </Link>
          </div>
        </div>
        <img
          className="detailphoto"
          src={"/images/" + x.image + ".webp"}
          width="650"
          height="550"
          alt={x.alt}
        />
      </div>
    </main>
  );
}
