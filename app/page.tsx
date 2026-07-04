import { Suspense } from "react";
import { GalleryClient } from "@/components/GalleryClient";
import { getAllSimulations, getFilterOptions } from "@/lib/catalog";
import { CLOUD_LABELS } from "@/lib/types";
import { CLOUD_DOT_CLASSES } from "@/lib/badges";
import { SITE } from "@/lib/site";

export default function HomePage() {
  const simulations = getAllSimulations();
  const filterOptions = getFilterOptions();

  const stats = filterOptions.clouds.map((cloud) => ({
    cloud,
    count: simulations.filter((s) => s.cloud === cloud).length,
  }));

  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-slate-950 bg-grid bg-aurora">
      <header className="sticky top-0 z-20 bg-slate-950/60 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
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
      </header>

      <section className="px-6 pb-16 pt-14 sm:pt-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            Tìm, xem và học hiểu{" "}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              kiến trúc Cloud
            </span>{" "}
            qua mô phỏng tương tác
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-400">
            Thư viện các mô phỏng trực quan giúp Solution Architect nắm rõ từng thành phần, luồng
            dữ liệu và cấu hình bên trong các kiến trúc AWS, Azure, GCP.
          </p>
          <a
            href="#gallery"
            className="flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:shadow-xl hover:shadow-sky-500/30"
          >
            Khám phá thư viện ↓
          </a>

          {stats.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {stats.map(({ cloud, count }) => (
                <div
                  key={cloud}
                  className="glass-card flex items-center gap-2 px-4 py-2.5 text-xs"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${CLOUD_DOT_CLASSES[cloud]}`} />
                  <span className="font-bold text-white">{CLOUD_LABELS[cloud]}</span>
                  <span className="text-slate-500">· {count} mô phỏng</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16">
        <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Đang tải...</div>}>
          <GalleryClient simulations={simulations} filterOptions={filterOptions} />
        </Suspense>
      </main>
    </div>
  );
}
