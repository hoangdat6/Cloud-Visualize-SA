import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SimulationPlayer } from "@/components/SimulationPlayer";
import { getAllSlugs, getSimulationBySlug } from "@/lib/catalog";
import { CLOUD_LABELS, DIFFICULTY_LABELS } from "@/lib/types";
import { CLOUD_BADGE_CLASSES, DIFFICULTY_BADGE_CLASSES } from "@/lib/badges";

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
    title: `${simulation.title} — Đang chạy — CloudViz SA`,
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
    <div className="flex h-screen flex-col bg-slate-950">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/90 px-4 py-3 backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={`/s/${simulation.slug}`}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Chi tiết
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-white">{simulation.title}</h1>
            <div className="mt-0.5 flex gap-1.5">
              <span
                className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${CLOUD_BADGE_CLASSES[simulation.cloud]}`}
              >
                {CLOUD_LABELS[simulation.cloud]}
              </span>
              <span
                className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${DIFFICULTY_BADGE_CLASSES[simulation.difficulty]}`}
              >
                {DIFFICULTY_LABELS[simulation.difficulty]}
              </span>
            </div>
          </div>
        </div>

        <a
          href={simulation.htmlPath}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-sky-500 hover:text-sky-300"
        >
          Mở tab mới
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </header>

      <SimulationPlayer slug={simulation.slug} htmlPath={simulation.htmlPath} title={simulation.title} />
    </div>
  );
}
