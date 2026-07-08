"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterBar } from "@/components/FilterBar";
import { SimulationCard } from "@/components/SimulationCard";
import type { FilterOptions } from "@/lib/catalog";
import type { Cloud, Difficulty, Domain, Simulation } from "@/lib/types";

interface GalleryClientProps {
  simulations: Simulation[];
  filterOptions: FilterOptions;
}

function readParam<T extends string>(value: string | null, allowed: readonly T[]): T | "all" {
  if (value && (allowed as readonly string[]).includes(value)) {
    return value as T;
  }
  return "all";
}

export function GalleryClient({ simulations, filterOptions }: GalleryClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const cloud = readParam<Cloud>(searchParams.get("cloud"), filterOptions.clouds);
  const domain = readParam<Domain>(searchParams.get("domain"), filterOptions.domains);
  const difficulty = readParam<Difficulty>(searchParams.get("difficulty"), filterOptions.difficulties);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === "" || value === "all") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
      const queryString = next.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

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
        onQueryChange={(value) => updateParams({ q: value })}
        cloud={cloud}
        onCloudChange={(value) => updateParams({ cloud: value })}
        domain={domain}
        onDomainChange={(value) => updateParams({ domain: value })}
        difficulty={difficulty}
        onDifficultyChange={(value) => updateParams({ difficulty: value })}
        options={filterOptions}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="glass-card marker-wash marker-wash-yellow flex flex-col items-center justify-center gap-2 py-20 text-center text-gray-600">
          <p className="text-sm">No simulations match your filters.</p>
          <p className="text-xs">Try a different keyword or filter.</p>
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
