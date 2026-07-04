import type { Cloud, Difficulty, Domain } from "@/lib/types";
import { CLOUD_LABELS, DIFFICULTY_LABELS, DOMAIN_LABELS } from "@/lib/types";
import type { FilterOptions } from "@/lib/catalog";

interface FilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  cloud: Cloud | "all";
  onCloudChange: (value: Cloud | "all") => void;
  domain: Domain | "all";
  onDomainChange: (value: Domain | "all") => void;
  difficulty: Difficulty | "all";
  onDifficultyChange: (value: Difficulty | "all") => void;
  options: FilterOptions;
  resultCount: number;
}

export function FilterBar({
  query,
  onQueryChange,
  cloud,
  onCloudChange,
  domain,
  onDomainChange,
  difficulty,
  onDifficultyChange,
  options,
  resultCount,
}: FilterBarProps) {
  const selectClasses =
    "rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-slate-200 transition focus:border-sky-500/60 focus:outline-none focus:ring-2 focus:ring-sky-500/30";

  return (
    <div className="glass-card flex flex-col gap-3 p-4 shadow-xl shadow-black/10 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Tìm theo tên, mô tả, tag..."
          className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 transition focus:border-sky-500/60 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={cloud}
          onChange={(e) => onCloudChange(e.target.value as Cloud | "all")}
          className={selectClasses}
        >
          <option value="all">Tất cả Cloud</option>
          {options.clouds.map((c) => (
            <option key={c} value={c}>
              {CLOUD_LABELS[c]}
            </option>
          ))}
        </select>

        <select
          value={domain}
          onChange={(e) => onDomainChange(e.target.value as Domain | "all")}
          className={selectClasses}
        >
          <option value="all">Tất cả Domain</option>
          {options.domains.map((d) => (
            <option key={d} value={d}>
              {DOMAIN_LABELS[d]}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value as Difficulty | "all")}
          className={selectClasses}
        >
          <option value="all">Tất cả độ khó</option>
          {options.difficulties.map((d) => (
            <option key={d} value={d}>
              {DIFFICULTY_LABELS[d]}
            </option>
          ))}
        </select>
      </div>

      <span className="shrink-0 text-xs text-slate-500">{resultCount} kết quả</span>
    </div>
  );
}
