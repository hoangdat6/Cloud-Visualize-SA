import { simulations } from "@/data/simulations";
import type { Cloud, Difficulty, Domain, Simulation } from "@/lib/types";

export function getAllSimulations(): Simulation[] {
  return [...simulations].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getSimulationBySlug(slug: string): Simulation | undefined {
  return simulations.find((s) => s.slug === slug);
}

export function getAllSlugs(): string[] {
  return simulations.map((s) => s.slug);
}

export interface FilterOptions {
  clouds: Cloud[];
  domains: Domain[];
  difficulties: Difficulty[];
}

/** Filter values present in the catalog (stays in sync as simulations are added). */
export function getFilterOptions(): FilterOptions {
  return {
    clouds: unique(simulations.map((s) => s.cloud)),
    domains: unique(simulations.map((s) => s.domain)),
    difficulties: unique(simulations.map((s) => s.difficulty)),
  };
}

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}
