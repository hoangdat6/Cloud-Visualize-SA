"use client";

import type { MouseEvent } from "react";
import { useStoredSet } from "@/hooks/useStoredSet";
import { SketchOverlay } from "@/components/SketchOverlay";

interface BookmarkButtonProps {
  slug: string;
  size?: "sm" | "lg";
}

export function BookmarkButton({ slug, size = "sm" }: BookmarkButtonProps) {
  const { hydrated, has, toggle } = useStoredSet("cloudviz:bookmarks");
  const bookmarked = hydrated && has(slug);

  function handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggle(slug);
  }

  const icon = (
    <svg
      className={size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"}
      fill={bookmarked ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"
      />
    </svg>
  );

  if (size === "lg") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={bookmarked}
        className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
          bookmarked
            ? "bg-transparent text-[var(--text-main)]"
            : "bg-transparent text-[var(--text-main)]"
        }`}
      >
        <SketchOverlay
          fill={bookmarked ? "rgba(255, 193, 83, 0.2)" : "rgba(157, 204, 244, 0.16)"}
          hachureGap={7}
          roughness={1.3}
        />
        {icon}
        {bookmarked ? "Saved" : "Save simulation"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark simulation"}
      className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
        bookmarked
          ? "bg-transparent text-[var(--text-main)]"
          : "bg-transparent text-gray-600"
      }`}
    >
      <SketchOverlay
        fill={bookmarked ? "rgba(255, 193, 83, 0.22)" : "rgba(255, 255, 255, 0.34)"}
        hachureGap={6}
        roughness={1.2}
      />
      {icon}
    </button>
  );
}
