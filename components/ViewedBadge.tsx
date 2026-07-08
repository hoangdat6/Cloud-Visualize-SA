"use client";

import { useStoredSet } from "@/hooks/useStoredSet";

interface ViewedBadgeProps {
  slug: string;
  size?: "sm" | "lg";
  className?: string;
}

export function ViewedBadge({ slug, size = "sm", className = "" }: ViewedBadgeProps) {
  const { hydrated, has } = useStoredSet("cloudviz:viewed");

  if (!hydrated || !has(slug)) return null;

  const sizeClasses =
    size === "lg"
      ? "px-3 py-1.5 text-xs border-2 border-[var(--box-green-border)]"
      : "px-2 py-0.5 text-[9px]";

  return (
    <span
      className={`flex w-fit items-center gap-1 rounded-full bg-[var(--box-green-bg)] font-bold text-[var(--text-green)] ${sizeClasses} ${className}`}
    >
      <svg
        className={size === "lg" ? "h-3.5 w-3.5" : "h-3 w-3"}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      Viewed
    </span>
  );
}
