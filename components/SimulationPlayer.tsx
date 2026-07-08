"use client";

import { useEffect, useRef, useState } from "react";
import { useStoredSet } from "@/hooks/useStoredSet";

interface SimulationPlayerProps {
  slug: string;
  htmlPath: string;
  title: string;
}

export function SimulationPlayer({ slug, htmlPath, title }: SimulationPlayerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { add } = useStoredSet("cloudviz:viewed");

  useEffect(() => {
    add(slug);
    // Only re-run when slug changes; `add` is stable for a fixed storage key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    function handleChange() {
      setIsFullscreen(document.fullscreenElement === wrapperRef.current);
    }
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  async function toggleFullscreen() {
    if (!wrapperRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await wrapperRef.current.requestFullscreen();
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white hd-shadow ${
        isFullscreen
          ? "rounded-none border-0"
          : "hd-border-soft"
      }`}
    >
      {/* Chrome bar */}
      <div className="flex shrink-0 items-center justify-between border-b-2 border-dashed border-gray-300 bg-[var(--box-yellow-bg)] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-2 hidden font-mono text-[10px] tracking-wide text-gray-600 sm:inline">
            simulation · {slug}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          className="hd-border flex items-center gap-1.5 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-main)] transition hover:bg-[var(--box-blue-bg)]"
        >
          {isFullscreen ? (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9L4 4m0 0v4m0-4h4m7 5l5-5m0 0v4m0-4h-4M9 15l-5 5m0 0v-4m0 4h4m7-5l5 5m0 0v-4m0 4h-4"
                />
              </svg>
              Exit
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              Fullscreen
            </>
          )}
        </button>
      </div>

      <iframe
        src={htmlPath}
        title={title}
        className="h-full w-full min-h-0 flex-1 border-0 bg-[var(--bg-paper)]"
        sandbox="allow-scripts allow-same-origin allow-popups allow-modals allow-forms"
        allow="fullscreen"
      />
    </div>
  );
}
