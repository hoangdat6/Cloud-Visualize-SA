import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DetailActions } from "@/components/DetailActions";
import { SketchOverlay } from "@/components/SketchOverlay";
import { getAllSlugs, getSimulationBySlug } from "@/lib/catalog";
import { CLOUD_LABELS, DIFFICULTY_LABELS, DOMAIN_LABELS } from "@/lib/types";
import {
  CLOUD_BADGE_CLASSES,
  CLOUD_CARD_ACCENT,
  CLOUD_DOT_CLASSES,
  DIFFICULTY_BADGE_CLASSES,
} from "@/lib/badges";
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

  const objectiveCount = simulation.objectives?.length ?? 0;
  const componentCount = simulation.components?.length ?? 0;

  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-[var(--bg-paper)] bg-grid bg-aurora text-[var(--text-main)]">
      <header className="sticky top-0 z-20 border-b-2 border-dashed border-gray-400 bg-[var(--bg-paper)]/90 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 transition hover:opacity-90"
          >
            <div className="hd-border flex h-10 w-10 shrink-0 rotate-[-3deg] items-center justify-center bg-white text-[var(--text-blue)] hd-shadow">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">{SITE.name}</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-blue)] underline decoration-wavy transition hover:text-[var(--text-red)]"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to library
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-20 pt-8 sm:pt-10">
        {/* Hero */}
        <section className="grid items-stretch gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${CLOUD_BADGE_CLASSES[simulation.cloud]}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${CLOUD_DOT_CLASSES[simulation.cloud]}`} />
                {CLOUD_LABELS[simulation.cloud]}
              </span>
              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${DIFFICULTY_BADGE_CLASSES[simulation.difficulty]}`}
              >
                {DIFFICULTY_LABELS[simulation.difficulty]}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                {DOMAIN_LABELS[simulation.domain]}
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight text-[var(--text-main)] sm:text-4xl">
              {simulation.title}
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-gray-700 sm:text-base">
              {simulation.longDescription ?? simulation.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={`/s/${simulation.slug}/play`}
                className="hd-border flex items-center gap-2 bg-[var(--box-green-bg)] px-6 py-3 text-sm font-bold text-[var(--text-main)] hd-shadow transition hover:bg-[var(--box-green-border)]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Open simulation
              </Link>
              <DetailActions slug={simulation.slug} />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {simulation.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-300 bg-[var(--box-yellow-bg)] px-2.5 py-1 text-[10px] font-mono text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Preview card */}
          <Link
            href={`/s/${simulation.slug}/play`}
            className="group relative flex min-h-[240px] overflow-hidden bg-white transition hd-border-soft hd-shadow"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${CLOUD_CARD_ACCENT[simulation.cloud]}`}
            />
            {simulation.thumbnail ? (
              <Image
                src={simulation.thumbnail}
                alt={simulation.title}
                fill
                className="object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                <div className="hd-border flex h-16 w-16 items-center justify-center bg-white transition group-hover:scale-110">
                  <svg className="h-7 w-7 text-[var(--text-main)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="section-header">
                  {CLOUD_LABELS[simulation.cloud]} · Interactive
                </span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--bg-paper)] via-[var(--bg-paper)]/70 to-transparent p-5 pt-12">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                    Live preview
                  </p>
                  <p className="text-sm font-bold text-[var(--text-main)]">Launch full simulation</p>
                </div>
                <span className="hd-border flex h-10 w-10 items-center justify-center bg-white text-[var(--text-main)] transition group-hover:bg-[var(--box-blue-bg)]">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </section>

        {/* Stats strip */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Cloud", value: CLOUD_LABELS[simulation.cloud] },
            { label: "Domain", value: DOMAIN_LABELS[simulation.domain] },
            { label: "Objectives", value: String(objectiveCount) },
            { label: "Components", value: String(componentCount) },
          ].map((stat) => (
            <div key={stat.label} className="relative px-4 py-3">
              <SketchOverlay fill="rgba(255, 193, 83, 0.14)" hachureGap={8} />
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                {stat.label}
              </p>
              <p className="mt-1 text-sm font-bold text-[var(--text-main)]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Objectives */}
        {simulation.objectives && simulation.objectives.length > 0 && (
          <section className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="section-header">Learning objectives</h2>
                <p className="mt-2 text-xs text-gray-600">
                  What you should understand after running this simulation.
                </p>
              </div>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {simulation.objectives.map((objective, index) => (
                <li
                  key={objective}
                  className="relative flex gap-3 p-4 transition"
                >
                  <SketchOverlay
                    fill={index % 2 === 0 ? "rgba(157, 204, 244, 0.16)" : "rgba(255, 193, 83, 0.15)"}
                    hachureGap={8}
                  />
                  <span className="marker-wash marker-wash-sm marker-wash-green flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--ink-faint)] bg-white/55 font-mono text-xs font-bold text-[var(--text-main)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-gray-700">{objective}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Components */}
        {simulation.components && simulation.components.length > 0 && (
          <section className="mt-12">
            <div className="mb-5">
              <h2 className="section-header">Key components</h2>
              <p className="mt-2 text-xs text-gray-600">
                Core building blocks you will interact with in the topology.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {simulation.components.map((component) => (
                <div
                  key={component.name}
                  className="group relative overflow-hidden p-5 transition"
                >
                  <SketchOverlay fill="rgba(255, 176, 103, 0.15)" hachureGap={9} />
                  <div
                    className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${CLOUD_CARD_ACCENT[simulation.cloud]} opacity-40 blur-xl transition group-hover:opacity-70`}
                  />
                  <h3 className="relative text-sm font-bold text-[var(--text-main)]">{component.name}</h3>
                  <p className="relative mt-1.5 text-xs leading-relaxed text-gray-700">
                    {component.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="relative mt-14 flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          <SketchOverlay fill="rgba(154, 222, 170, 0.16)" hachureGap={9} />
          <div>
            <h2 className="text-lg font-bold text-[var(--text-main)]">Ready to explore?</h2>
            <p className="mt-1 max-w-md text-sm text-gray-700">
              Open the interactive topology, switch Physical/Logical views, and run packet-flow
              scenarios.
            </p>
          </div>
          <Link
            href={`/s/${simulation.slug}/play`}
            className="hd-border flex shrink-0 items-center gap-2 bg-[var(--box-green-bg)] px-6 py-3 text-sm font-bold text-[var(--text-main)] hd-shadow transition hover:bg-[var(--box-green-border)]"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Open simulation
          </Link>
        </section>
      </main>
    </div>
  );
}
