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
    <div className="relative flex min-h-full flex-1 flex-col bg-[var(--bg-paper)] bg-grid bg-aurora text-[var(--text-main)]">
      <header className="sticky top-0 z-20 border-b-2 border-dashed border-gray-400 bg-[var(--bg-paper)]/90 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="hd-border flex h-12 w-12 shrink-0 rotate-[-3deg] items-center justify-center bg-white text-[var(--text-blue)] hd-shadow">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">{SITE.name}</span>
          </div>
          <a
            href="#gallery"
            className="hidden text-xs font-bold text-[var(--text-blue)] underline decoration-wavy transition hover:text-[var(--text-red)] sm:inline"
          >
            Simulation library
          </a>
        </div>
      </header>

      <section className="px-6 pb-12 pt-10 sm:pt-14 lg:pb-20 lg:pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col items-start gap-6">
            <span className="section-header">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--text-blue)]" />
              Interactive architecture lab
            </span>

            <h1 className="text-4xl font-bold leading-[1.15] text-[var(--text-main)] sm:text-5xl">
              Explore and learn{" "}
              <span className="rounded-xl bg-[var(--box-yellow-bg)] px-2 text-[var(--text-blue)] underline decoration-wavy decoration-[var(--text-red)]">
                cloud architecture
              </span>{" "}
              through interactive simulations
            </h1>

            <p className="max-w-lg text-sm leading-relaxed text-gray-700 sm:text-base">
              A library of visual simulations that help Solution Architects understand components,
              data flows, and configuration inside AWS, Azure, and GCP architectures.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#gallery"
                className="hd-border flex w-fit items-center gap-2 bg-[var(--box-green-bg)] px-6 py-3 text-sm font-bold text-[var(--text-main)] hd-shadow transition hover:bg-[var(--box-green-border)]"
              >
                Browse library ↓
              </a>
              {featured && (
                <Link
                  href={`/s/${featured.slug}/play`}
                  className="hd-border-alt flex w-fit items-center gap-2 bg-white px-5 py-3 text-sm font-bold text-[var(--text-main)] hd-shadow transition hover:bg-[var(--box-yellow-bg)]"
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
                <span className="text-2xl font-bold text-[var(--text-main)]">{total}</span>
                <span className="text-xs text-gray-600">
                  {total === 1 ? "simulation" : "simulations"}
                </span>
              </div>
              <span className="h-4 border-l-2 border-dashed border-gray-400" />
              {stats.map(({ cloud, count }) => (
                <div key={cloud} className="flex items-center gap-1.5 text-xs">
                  <span className={`h-1.5 w-1.5 rounded-full ${CLOUD_DOT_CLASSES[cloud]}`} />
                  <span className="font-bold text-[var(--text-main)]">{CLOUD_LABELS[cloud]}</span>
                  <span className="text-gray-600">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-2">
            <HeroTopology />
          </div>
        </div>
      </section>

      <main id="gallery" className="mx-auto w-full max-w-6xl flex-1 pb-16">
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-header">Simulation library</h2>
            <p className="mt-2 text-xs text-gray-600">
              Filter by cloud, domain, or difficulty — open any simulation to explore.
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="py-20 text-center text-sm text-gray-600">Loading...</div>}>
          <GalleryClient simulations={simulations} filterOptions={filterOptions} />
        </Suspense>
      </main>
    </div>
  );
}
