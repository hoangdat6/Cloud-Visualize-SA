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
      className={`relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-950 shadow-2xl shadow-black/40 ${
        isFullscreen
          ? "rounded-none border-0"
          : "rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-sm"
      }`}
    >
      {/* Chrome bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-white/[0.03] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-2 hidden font-mono text-[10px] tracking-wide text-slate-500 sm:inline">
            simulation · {slug}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300 transition hover:border-sky-500/50 hover:text-sky-300"
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
        className="h-full w-full min-h-0 flex-1 border-0 bg-slate-950"
        sandbox="allow-scripts allow-same-origin allow-popups allow-modals allow-forms"
        allow="fullscreen"
      />
    </div>
  );
}
