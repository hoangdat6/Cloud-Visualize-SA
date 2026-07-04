import type { Cloud, Difficulty } from "@/lib/types";

export const CLOUD_BADGE_CLASSES: Record<Cloud, string> = {
  aws: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  azure: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  gcp: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  multi: "bg-purple-500/15 text-purple-300 border-purple-500/30",
};

export const CLOUD_CARD_ACCENT: Record<Cloud, string> = {
  aws: "from-orange-500/20 to-slate-900",
  azure: "from-sky-500/20 to-slate-900",
  gcp: "from-emerald-500/20 to-slate-900",
  multi: "from-purple-500/20 to-slate-900",
};

export const CLOUD_DOT_CLASSES: Record<Cloud, string> = {
  aws: "bg-orange-400",
  azure: "bg-sky-400",
  gcp: "bg-emerald-400",
  multi: "bg-purple-400",
};

export const DIFFICULTY_BADGE_CLASSES: Record<Difficulty, string> = {
  beginner: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  intermediate: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  advanced: "bg-red-500/15 text-red-300 border-red-500/30",
};
