import Link from "next/link";
import Image from "next/image";
import type { Simulation } from "@/lib/types";
import { CLOUD_LABELS, DIFFICULTY_LABELS } from "@/lib/types";
import { CLOUD_BADGE_CLASSES, CLOUD_CARD_ACCENT, DIFFICULTY_BADGE_CLASSES } from "@/lib/badges";

export function SimulationCard({ simulation }: { simulation: Simulation }) {
  const visibleTags = simulation.tags.slice(0, 3);
  const extraTagCount = simulation.tags.length - visibleTags.length;

  return (
    <Link
      href={`/s/${simulation.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg transition hover:-translate-y-0.5 hover:border-slate-600 hover:shadow-xl"
    >
      <div
        className={`relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br ${CLOUD_CARD_ACCENT[simulation.cloud]}`}
      >
        {simulation.thumbnail ? (
          <Image
            src={simulation.thumbnail}
            alt={simulation.title}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300/70">
            {CLOUD_LABELS[simulation.cloud]}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${CLOUD_BADGE_CLASSES[simulation.cloud]}`}
          >
            {CLOUD_LABELS[simulation.cloud]}
          </span>
          <span
            className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${DIFFICULTY_BADGE_CLASSES[simulation.difficulty]}`}
          >
            {DIFFICULTY_LABELS[simulation.difficulty]}
          </span>
        </div>

        <h3 className="text-sm font-bold text-white transition group-hover:text-sky-300">
          {simulation.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-slate-400">
          {simulation.description}
        </p>

        <div className="flex flex-wrap gap-1 pt-1">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-400"
            >
              {tag}
            </span>
          ))}
          {extraTagCount > 0 && (
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-500">
              +{extraTagCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
