import { GalleryClient } from "@/components/GalleryClient";
import { getAllSimulations, getFilterOptions } from "@/lib/catalog";

export default function HomePage() {
  const simulations = getAllSimulations();
  const filterOptions = getFilterOptions();

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
            <h1 className="text-lg font-bold uppercase tracking-wider text-white">
              CloudViz SA
            </h1>
            <p className="mt-0.5 text-xs text-slate-400">
              Thư viện mô phỏng kiến trúc Cloud cho Solution Architect — AWS · Azure · GCP
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <GalleryClient simulations={simulations} filterOptions={filterOptions} />
      </main>
    </div>
  );
}
