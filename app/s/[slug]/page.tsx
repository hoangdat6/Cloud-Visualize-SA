import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DetailActions } from "@/components/DetailActions";
import { getAllSlugs, getSimulationBySlug } from "@/lib/catalog";
import { CLOUD_LABELS, DIFFICULTY_LABELS } from "@/lib/types";
import { CLOUD_BADGE_CLASSES, DIFFICULTY_BADGE_CLASSES } from "@/lib/badges";
import { SITE } from "@/lib/site";

interface DetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const simulation = getSimulationBySlug(slug);
  if (!simulation) return {};

  const url = `${SITE.url}/s/${simulation.slug}`;
  return {
    title: `${simulation.title} — CloudViz SA`,
    description: simulation.description,
    alternates: { canonical: url },
    openGraph: {
      title: simulation.title,
      description: simulation.description,
      url,
      siteName: SITE.name,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: simulation.title,
      description: simulation.description,
    },
  };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const simulation = getSimulationBySlug(slug);

  if (!simulation) {
    notFound();
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-slate-950 bg-grid bg-aurora">
      <header className="sticky top-0 z-20 bg-slate-950/60 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="flex w-fit items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-white"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to library
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 pb-16 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${CLOUD_BADGE_CLASSES[simulation.cloud]}`}
          >
            {CLOUD_LABELS[simulation.cloud]}
          </span>
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${DIFFICULTY_BADGE_CLASSES[simulation.difficulty]}`}
          >
            {DIFFICULTY_LABELS[simulation.difficulty]}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-white sm:text-3xl">{simulation.title}</h1>
        <p className="text-sm leading-relaxed text-slate-300">
          {simulation.longDescription ?? simulation.description}
        </p>

        <DetailActions slug={simulation.slug} />

        {simulation.objectives && simulation.objectives.length > 0 && (
          <section className="glass-card p-5">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Learning objectives
            </h2>
            <ul className="flex flex-col gap-2">
              {simulation.objectives.map((objective) => (
                <li key={objective} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                  {objective}
                </li>
              ))}
            </ul>
          </section>
        )}

        {simulation.components && simulation.components.length > 0 && (
          <section className="glass-card p-5">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Key components
            </h2>
            <dl className="flex flex-col gap-3">
              {simulation.components.map((component) => (
                <div key={component.name}>
                  <dt className="text-sm font-bold text-white">{component.name}</dt>
                  <dd className="text-xs leading-relaxed text-slate-400">{component.description}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="flex flex-wrap gap-1.5">
          {simulation.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-mono text-slate-400">
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/s/${simulation.slug}/play`}
          className="flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:shadow-xl hover:shadow-sky-500/30"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Open simulation
        </Link>
      </main>
    </div>
  );
}
