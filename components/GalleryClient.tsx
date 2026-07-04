"use client";

import { useMemo, useState } from "react";
import { FilterBar } from "@/components/FilterBar";
import { SimulationCard } from "@/components/SimulationCard";
import type { FilterOptions } from "@/lib/catalog";
import type { Cloud, Difficulty, Domain, Simulation } from "@/lib/types";

interface GalleryClientProps {
  simulations: Simulation[];
  filterOptions: FilterOptions;
}

export function GalleryClient({ simulations, filterOptions }: GalleryClientProps) {
  const [query, setQuery] = useState("");
  const [cloud, setCloud] = useState<Cloud | "all">("all");
  const [domain, setDomain] = useState<Domain | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return simulations.filter((s) => {
      const matchQuery =
        q === "" ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));
      const matchCloud = cloud === "all" || s.cloud === cloud;
      const matchDomain = domain === "all" || s.domain === domain;
      const matchDifficulty = difficulty === "all" || s.difficulty === difficulty;
      return matchQuery && matchCloud && matchDomain && matchDifficulty;
    });
  }, [simulations, query, cloud, domain, difficulty]);

  return (
    <div className="flex flex-col gap-6">
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        cloud={cloud}
        onCloudChange={setCloud}
        domain={domain}
        onDomainChange={setDomain}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        options={filterOptions}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-800 py-20 text-center text-slate-500">
          <p className="text-sm">Không tìm thấy mô phỏng phù hợp.</p>
          <p className="text-xs">Thử điều chỉnh từ khoá hoặc bộ lọc.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((s) => (
            <SimulationCard key={s.slug} simulation={s} />
          ))}
        </div>
      )}
    </div>
  );
}
