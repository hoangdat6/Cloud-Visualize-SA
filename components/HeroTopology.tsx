/**
 * Panel trang trí dạng mô phỏng kiến trúc cloud cho hero trang chủ.
 * Pure CSS/SVG — không cần JS, không tương tác.
 */
export function HeroTopology() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 rotate-[-1deg] rounded-[2rem] bg-[var(--box-yellow-bg)] opacity-70"
      />

      <div className="relative overflow-hidden bg-white hd-border-soft hd-shadow">
        <div className="flex items-center justify-between border-b-2 border-dashed border-gray-300 bg-[var(--box-yellow-bg)] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          </div>
          <span className="font-mono text-[10px] tracking-wide text-gray-600">
            topology · live preview
          </span>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-green)]">
              Active
            </span>
          </div>
        </div>

        {/* Canvas topology */}
        <div className="relative aspect-[5/4] bg-[var(--bg-paper)] p-4 sm:p-6">
          {/* Grid nội bộ nhẹ */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(51,51,51,0.16) 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          />

          <svg
            viewBox="0 0 400 320"
            className="relative h-full w-full"
            role="img"
            aria-label="Cloud topology preview: on-premises connected to AWS via Direct Connect and Transit Gateway"
          >
            <defs>
              <linearGradient id="link-sky" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="link-orange" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fb923c" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#fb923c" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#fb923c" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="link-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#c084fc" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.15" />
              </linearGradient>
              <filter id="node-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Links */}
            <path
              d="M70 160 C120 160, 130 90, 180 90"
              fill="none"
              stroke="url(#link-orange)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="topo-dash"
            />
            <path
              d="M220 90 C270 90, 280 160, 330 160"
              fill="none"
              stroke="url(#link-sky)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="topo-dash topo-dash-delay"
            />
            <path
              d="M200 130 L200 200"
              fill="none"
              stroke="url(#link-purple)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="topo-dash"
            />
            <path
              d="M200 240 C200 270, 120 280, 90 280"
              fill="none"
              stroke="url(#link-sky)"
              strokeWidth="1.2"
              strokeDasharray="3 4"
              className="topo-dash topo-dash-delay"
            />
            <path
              d="M200 240 C200 270, 280 280, 310 280"
              fill="none"
              stroke="url(#link-sky)"
              strokeWidth="1.2"
              strokeDasharray="3 4"
              className="topo-dash"
            />

            {/* Packet dots di chuyển trên link */}
            <circle r="3" fill="#fb923c" className="topo-packet topo-packet-a" filter="url(#node-glow)">
              <animateMotion
                dur="3.2s"
                repeatCount="indefinite"
                path="M70 160 C120 160, 130 90, 180 90"
              />
            </circle>
            <circle r="3" fill="#38bdf8" className="topo-packet topo-packet-b" filter="url(#node-glow)">
              <animateMotion
                dur="2.8s"
                repeatCount="indefinite"
                path="M220 90 C270 90, 280 160, 330 160"
              />
            </circle>
            <circle r="2.5" fill="#c084fc" filter="url(#node-glow)">
              <animateMotion dur="2.4s" repeatCount="indefinite" path="M200 130 L200 200" />
            </circle>

            {/* Node: On-Prem */}
            <g transform="translate(30, 130)">
              <rect
                width="80"
                height="60"
                rx="10"
                fill="rgba(251,146,60,0.08)"
                stroke="rgba(251,146,60,0.45)"
                strokeWidth="1"
              />
              <text
                x="40"
                y="26"
                textAnchor="middle"
                fill="#fdba74"
                fontSize="9"
                fontWeight="700"
                fontFamily="ui-monospace, monospace"
              >
                ON-PREM
              </text>
              <text
                x="40"
                y="42"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="8"
                fontFamily="ui-sans-serif, system-ui"
              >
                CE Router
              </text>
            </g>

            {/* Node: DXGW */}
            <g transform="translate(155, 55)">
              <rect
                width="90"
                height="60"
                rx="10"
                fill="rgba(56,189,248,0.08)"
                stroke="rgba(56,189,248,0.5)"
                strokeWidth="1"
                filter="url(#node-glow)"
              />
              <text
                x="45"
                y="26"
                textAnchor="middle"
                fill="#7dd3fc"
                fontSize="9"
                fontWeight="700"
                fontFamily="ui-monospace, monospace"
              >
                DXGW
              </text>
              <text
                x="45"
                y="42"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="8"
                fontFamily="ui-sans-serif, system-ui"
              >
                Direct Connect
              </text>
            </g>

            {/* Node: TGW (center) */}
            <g transform="translate(155, 200)">
              <rect
                width="90"
                height="60"
                rx="10"
                fill="rgba(192,132,252,0.1)"
                stroke="rgba(192,132,252,0.55)"
                strokeWidth="1"
                filter="url(#node-glow)"
              />
              <text
                x="45"
                y="26"
                textAnchor="middle"
                fill="#d8b4fe"
                fontSize="9"
                fontWeight="700"
                fontFamily="ui-monospace, monospace"
              >
                TGW
              </text>
              <text
                x="45"
                y="42"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="8"
                fontFamily="ui-sans-serif, system-ui"
              >
                Transit Gateway
              </text>
            </g>

            {/* Node: AWS Region */}
            <g transform="translate(290, 130)">
              <rect
                width="80"
                height="60"
                rx="10"
                fill="rgba(56,189,248,0.08)"
                stroke="rgba(56,189,248,0.45)"
                strokeWidth="1"
              />
              <text
                x="40"
                y="26"
                textAnchor="middle"
                fill="#7dd3fc"
                fontSize="9"
                fontWeight="700"
                fontFamily="ui-monospace, monospace"
              >
                AWS
              </text>
              <text
                x="40"
                y="42"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="8"
                fontFamily="ui-sans-serif, system-ui"
              >
                Region
              </text>
            </g>

            {/* VPC spokes */}
            <g transform="translate(50, 260)">
              <rect
                width="80"
                height="36"
                rx="8"
                fill="rgba(52,211,153,0.08)"
                stroke="rgba(52,211,153,0.4)"
                strokeWidth="1"
              />
              <text
                x="40"
                y="22"
                textAnchor="middle"
                fill="#6ee7b7"
                fontSize="9"
                fontWeight="600"
                fontFamily="ui-monospace, monospace"
              >
                VPC · Prod
              </text>
            </g>
            <g transform="translate(270, 260)">
              <rect
                width="80"
                height="36"
                rx="8"
                fill="rgba(52,211,153,0.08)"
                stroke="rgba(52,211,153,0.4)"
                strokeWidth="1"
              />
              <text
                x="40"
                y="22"
                textAnchor="middle"
                fill="#6ee7b7"
                fontSize="9"
                fontWeight="600"
                fontFamily="ui-monospace, monospace"
              >
                VPC · Shared
              </text>
            </g>
          </svg>

          {/* Floating chips góc dưới */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-[var(--box-orange-border)] bg-[var(--box-orange-bg)] px-2 py-0.5 text-[9px] font-mono font-bold text-[var(--text-main)]">
              Private VIF
            </span>
            <span className="rounded-full border border-[var(--box-blue-border)] bg-[var(--box-blue-bg)] px-2 py-0.5 text-[9px] font-mono font-bold text-[var(--text-main)]">
              BGP
            </span>
            <span className="rounded-full border border-[var(--box-purple-border)] bg-[var(--box-purple-bg)] px-2 py-0.5 text-[9px] font-mono font-bold text-[var(--text-main)]">
              Transit VIF
            </span>
          </div>
        </div>

        {/* Footer metrics giả lập */}
        <div className="grid grid-cols-3 gap-px border-t-2 border-dashed border-gray-300 bg-white">
          {[
            { label: "Latency", value: "2.1 ms" },
            { label: "Routes", value: "48" },
            { label: "VIFs", value: "3" },
          ].map((metric) => (
            <div key={metric.label} className="px-3 py-2.5 text-center">
              <div className="text-[9px] uppercase tracking-wider text-gray-600">{metric.label}</div>
              <div className="mt-0.5 font-mono text-xs font-bold text-[var(--text-main)]">{metric.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
