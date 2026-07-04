"use client";

import type { MouseEvent } from "react";
import { useStoredSet } from "@/hooks/useStoredSet";

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
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${
          bookmarked
            ? "border-amber-400/60 bg-amber-400/20 text-amber-300"
            : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:text-white"
        }`}
      >
        {icon}
        {bookmarked ? "Đã lưu" : "Lưu mô phỏng"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Bỏ đánh dấu mô phỏng" : "Đánh dấu mô phỏng"}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border backdrop-blur-sm transition ${
        bookmarked
          ? "border-amber-400/60 bg-amber-400/20 text-amber-300"
          : "border-white/10 bg-slate-950/60 text-slate-400 hover:border-white/25 hover:text-slate-200"
      }`}
    >
      {icon}
    </button>
  );
}
