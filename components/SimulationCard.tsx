import Link from "next/link";
import Image from "next/image";
import type { Simulation } from "@/lib/types";
import { CLOUD_LABELS, DIFFICULTY_LABELS } from "@/lib/types";
import { CLOUD_BADGE_CLASSES, DIFFICULTY_BADGE_CLASSES } from "@/lib/badges";
import { BookmarkButton } from "@/components/BookmarkButton";
import { SketchOverlay } from "@/components/SketchOverlay";
import { ViewedBadge } from "@/components/ViewedBadge";

const CARD_SKETCH_FILLS: Record<Simulation["cloud"], string> = {
  aws: "rgba(255, 176, 103, 0.2)",
  azure: "rgba(157, 204, 244, 0.2)",
  gcp: "rgba(154, 222, 170, 0.2)",
  multi: "rgba(181, 169, 225, 0.2)",
};

export function SimulationCard({ simulation }: { simulation: Simulation }) {
  const visibleTags = simulation.tags.slice(0, 3);
  const extraTagCount = simulation.tags.length - visibleTags.length;

  return (
    <Link
      href={`/s/${simulation.slug}`}
      className="group relative flex flex-col overflow-hidden bg-transparent p-[10px] transition duration-300 hover:-translate-y-1"
    >
      <SketchOverlay fill={CARD_SKETCH_FILLS[simulation.cloud]} hachureGap={8} />
      <div
        className="relative flex h-32 items-center justify-center overflow-hidden border-b-2 border-dashed border-gray-300 bg-transparent"
      >
        {simulation.thumbnail ? (
          <Image
            src={simulation.thumbnail}
            alt={simulation.title}
            fill
            className="object-cover"
          />
        ) : (
          <span className="rounded-xl bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--text-main)]">
            {CLOUD_LABELS[simulation.cloud]}
          </span>
        )}

        <div className="absolute right-2 top-2">
          <BookmarkButton slug={simulation.slug} />
        </div>

        <ViewedBadge slug={simulation.slug} className="absolute bottom-2 left-2" />
      </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${CLOUD_BADGE_CLASSES[simulation.cloud]}`}
          >
            {CLOUD_LABELS[simulation.cloud]}
          </span>
          <span
            className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${DIFFICULTY_BADGE_CLASSES[simulation.difficulty]}`}
          >
            {DIFFICULTY_LABELS[simulation.difficulty]}
          </span>
        </div>

        <h3 className="text-sm font-bold text-[var(--text-main)] transition group-hover:text-[var(--text-blue)]">
          {simulation.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-gray-700">
          {simulation.description}
        </p>

        <div className="flex flex-wrap gap-1 pt-1">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-300 bg-[var(--box-yellow-bg)] px-2 py-0.5 text-[9px] font-mono text-gray-700"
            >
              {tag}
            </span>
          ))}
          {extraTagCount > 0 && (
            <span className="rounded-full border border-gray-300 bg-white px-2 py-0.5 text-[9px] font-mono text-gray-600">
              +{extraTagCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
