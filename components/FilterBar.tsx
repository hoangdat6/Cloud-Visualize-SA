"use client";

import type { Cloud, Difficulty, Domain } from "@/lib/types";
import { CLOUD_LABELS, DIFFICULTY_LABELS, DOMAIN_LABELS } from "@/lib/types";
import type { FilterOptions } from "@/lib/catalog";
import { Select } from "@/components/ui/Select";

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
  const cloudOptions = [
    { value: "all", label: "All clouds" },
    ...options.clouds.map((c) => ({ value: c, label: CLOUD_LABELS[c] })),
  ];

  const domainOptions = [
    { value: "all", label: "All domains" },
    ...options.domains.map((d) => ({ value: d, label: DOMAIN_LABELS[d] })),
  ];

  const difficultyOptions = [
    { value: "all", label: "All levels" },
    ...options.difficulties.map((d) => ({ value: d, label: DIFFICULTY_LABELS[d] })),
  ];

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
          placeholder="Search by name, description, or tag..."
          className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 transition focus:border-sky-500/60 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={cloud}
          onValueChange={(value) => onCloudChange(value as Cloud | "all")}
          options={cloudOptions}
          ariaLabel="Filter by cloud"
        />
        <Select
          value={domain}
          onValueChange={(value) => onDomainChange(value as Domain | "all")}
          options={domainOptions}
          ariaLabel="Filter by domain"
        />
        <Select
          value={difficulty}
          onValueChange={(value) => onDifficultyChange(value as Difficulty | "all")}
          options={difficultyOptions}
          ariaLabel="Filter by difficulty"
        />
      </div>

      <span className="shrink-0 text-xs text-slate-500">
        {resultCount} {resultCount === 1 ? "result" : "results"}
      </span>
    </div>
  );
}
