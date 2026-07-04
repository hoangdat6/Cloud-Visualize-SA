import { Suspense } from "react";
import { GalleryClient } from "@/components/GalleryClient";
import { getAllSimulations, getFilterOptions } from "@/lib/catalog";
import { CLOUD_LABELS } from "@/lib/types";
import { SITE } from "@/lib/site";

export default function HomePage() {
  const simulations = getAllSimulations();
  const filterOptions = getFilterOptions();

  const stats = filterOptions.clouds.map((cloud) => ({
    cloud,
    count: simulations.filter((s) => s.cloud === cloud).length,
  }));

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-950 bg-grid">
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-6 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
            <svg
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wider text-white">{SITE.name}</h1>
            <p className="mt-0.5 text-xs text-slate-400">{SITE.description}</p>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-800 bg-slate-900/40 px-6 py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6">
          <h2 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
            Tìm, xem và học hiểu kiến trúc Cloud qua mô phỏng tương tác
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-400">
            Thư viện các mô phỏng trực quan giúp Solution Architect nắm rõ từng thành phần, luồng
            dữ liệu và cấu hình bên trong các kiến trúc AWS, Azure, GCP.
          </p>
          <a
            href="#gallery"
            className="flex w-fit items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-500"
          >
            Khám phá thư viện ↓
          </a>

          {stats.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {stats.map(({ cloud, count }) => (
                <div key={cloud} className="rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs">
                  <span className="font-bold text-white">{CLOUD_LABELS[cloud]}</span>
                  <span className="ml-1.5 text-slate-500">· {count} mô phỏng</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Đang tải...</div>}>
          <GalleryClient simulations={simulations} filterOptions={filterOptions} />
        </Suspense>
      </main>
    </div>
  );
}
