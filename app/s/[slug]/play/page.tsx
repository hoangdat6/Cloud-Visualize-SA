import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SimulationPlayer } from "@/components/SimulationPlayer";
import { getAllSlugs, getSimulationBySlug } from "@/lib/catalog";
import { CLOUD_LABELS, DIFFICULTY_LABELS } from "@/lib/types";
import {
  CLOUD_BADGE_CLASSES,
  CLOUD_DOT_CLASSES,
  DIFFICULTY_BADGE_CLASSES,
} from "@/lib/badges";
import { SITE } from "@/lib/site";

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PlayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const simulation = getSimulationBySlug(slug);
  if (!simulation) return {};
  return {
    title: `${simulation.title} — Playing — CloudViz SA`,
    description: simulation.description,
  };
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const simulation = getSimulationBySlug(slug);

  if (!simulation) {
    notFound();
  }

  return (
    <div className="relative flex h-screen flex-col bg-slate-950 bg-grid bg-aurora">
      <header className="z-20 shrink-0 bg-slate-950/60 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Link href="/" className="hidden shrink-0 items-center gap-2.5 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-purple-500 shadow-lg shadow-sky-500/20">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-bold uppercase tracking-wider text-white">{SITE.name}</span>
            </Link>

            <span className="hidden h-6 w-px bg-white/10 sm:block" />

            <Link
              href={`/s/${simulation.slug}`}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Details
            </Link>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-white">{simulation.title}</h1>
              <div className="mt-0.5 flex flex-wrap gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${CLOUD_BADGE_CLASSES[simulation.cloud]}`}
                >
                  <span className={`h-1 w-1 rounded-full ${CLOUD_DOT_CLASSES[simulation.cloud]}`} />
                  {CLOUD_LABELS[simulation.cloud]}
                </span>
                <span
                  className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${DIFFICULTY_BADGE_CLASSES[simulation.difficulty]}`}
                >
                  {DIFFICULTY_LABELS[simulation.difficulty]}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 sm:inline-flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Live
            </span>
            <a
              href={simulation.htmlPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-sky-500/50 hover:text-sky-300"
            >
              <span className="hidden sm:inline">Open in new tab</span>
              <span className="sm:hidden">New tab</span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1600px] min-h-0 flex-1 flex-col p-3 sm:p-4">
        <SimulationPlayer
          slug={simulation.slug}
          htmlPath={simulation.htmlPath}
          title={simulation.title}
        />
      </main>
    </div>
  );
}
