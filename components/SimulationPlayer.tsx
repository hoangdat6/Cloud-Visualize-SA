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
    // Chỉ cần chạy khi slug đổi; `add` là hàm ổn định theo storageKey cố định.
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
    <div ref={wrapperRef} className="relative flex flex-1 flex-col bg-slate-950">
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Thoát toàn màn hình" : "Xem toàn màn hình"}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 text-slate-300 backdrop-blur-md transition hover:border-sky-500/50 hover:text-sky-300"
      >
        {isFullscreen ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9L4 4m0 0v4m0-4h4m7 5l5-5m0 0v4m0-4h-4M9 15l-5 5m0 0v-4m0 4h4m7-5l5 5m0 0v-4m0 4h-4"
            />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        )}
      </button>
      <iframe
        src={htmlPath}
        title={title}
        className="h-full w-full flex-1 border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-modals allow-forms"
      />
    </div>
  );
}
