import { Suspense } from "react";
import Link from "next/link";
import { GalleryClient } from "@/components/GalleryClient";
import { HeroTopology } from "@/components/HeroTopology";
import { getAllSimulations, getFilterOptions } from "@/lib/catalog";
import { CLOUD_LABELS } from "@/lib/types";
import { CLOUD_DOT_CLASSES } from "@/lib/badges";
import { SITE } from "@/lib/site";

export default function HomePage() {
  const simulations = getAllSimulations();
  const filterOptions = getFilterOptions();
  const total = simulations.length;
  const featured = simulations[0];

  const stats = filterOptions.clouds.map((cloud) => ({
    cloud,
    count: simulations.filter((s) => s.cloud === cloud).length,
  }));

  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-slate-950 bg-grid bg-aurora">
      <header className="sticky top-0 z-20 bg-slate-950/60 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-purple-500 shadow-lg shadow-sky-500/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-white">{SITE.name}</span>
          </div>
          <a
            href="#gallery"
            className="hidden text-xs font-medium text-slate-400 transition hover:text-white sm:inline"
          >
            Simulation library
          </a>
        </div>
      </header>

      <section className="px-6 pb-12 pt-10 sm:pt-14 lg:pb-20 lg:pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              Interactive architecture lab
            </span>

            <h1 className="text-4xl font-bold leading-[1.15] text-white sm:text-5xl">
              Explore and learn{" "}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                cloud architecture
              </span>{" "}
              through interactive simulations
            </h1>

            <p className="max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base">
              A library of visual simulations that help Solution Architects understand components,
              data flows, and configuration inside AWS, Azure, and GCP architectures.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#gallery"
                className="flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:shadow-xl hover:shadow-sky-500/30"
              >
                Browse library ↓
              </a>
              {featured && (
                <Link
                  href={`/s/${featured.slug}/play`}
                  className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-white/20 hover:text-white"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Run demo
                </Link>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-white">{total}</span>
                <span className="text-xs text-slate-500">
                  {total === 1 ? "simulation" : "simulations"}
                </span>
              </div>
              <span className="h-4 w-px bg-white/10" />
              {stats.map(({ cloud, count }) => (
                <div key={cloud} className="flex items-center gap-1.5 text-xs">
                  <span className={`h-1.5 w-1.5 rounded-full ${CLOUD_DOT_CLASSES[cloud]}`} />
                  <span className="font-bold text-slate-200">{CLOUD_LABELS[cloud]}</span>
                  <span className="text-slate-500">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-2">
            <HeroTopology />
          </div>
        </div>
      </section>

      <main id="gallery" className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16">
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Simulation library</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Filter by cloud, domain, or difficulty — open any simulation to explore.
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading...</div>}>
          <GalleryClient simulations={simulations} filterOptions={filterOptions} />
        </Suspense>
      </main>
    </div>
  );
}
