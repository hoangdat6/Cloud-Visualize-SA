"use client";

import { useEffect, useId, useRef } from "react";
import rough from "roughjs";

interface SketchOverlayProps {
  fill?: string;
  stroke?: string;
  roughness?: number;
  hachureGap?: number;
  hachureAngle?: number;
  className?: string;
}

export function SketchOverlay({
  fill = "rgba(255, 193, 83, 0.22)",
  stroke = "rgba(109, 98, 87, 0.75)",
  roughness = 1.6,
  hachureGap = 9,
  hachureAngle = -35,
  className = "",
}: SketchOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const seed = Number(useId().replace(/\D/g, "").slice(0, 6)) || 11;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    function draw() {
      if (!svg) return;
      const { width, height } = svg.getBoundingClientRect();
      svg.replaceChildren();
      if (width < 8 || height < 8) return;

      const rc = rough.svg(svg);
      const inset = 5;
      const node = rc.rectangle(inset, inset, width - inset * 2, height - inset * 2, {
        seed,
        roughness,
        bowing: 1.4,
        stroke,
        strokeWidth: 1.35,
        fill,
        fillStyle: "hachure",
        hachureGap,
        hachureAngle,
        fillWeight: 1.15,
      });
      svg.appendChild(node);
    }

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [fill, hachureAngle, hachureGap, roughness, seed, stroke]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
