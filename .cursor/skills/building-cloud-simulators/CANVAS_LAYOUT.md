# Canvas Layout — Zoom/Pan Simulator Shell

Use this when the simulator has a **multi-component topology** or **lifecycle diagram** that must stay visible without page scroll. The learner explores the diagram inside a pan/zoom canvas while steps stay on the left and technical detail stays on the right.

## When to Use

| Use canvas layout | Use a different layout |
|---|---|
| Multi-zone topology (on-prem → cloud, control vs data plane) | Single-lane protocol flow with few nodes (`aws_ldap_flow_interactive.html`) |
| 6+ clickable architecture components | Side-by-side comparison only (SAML vs OIDC) |
| Diagram wider than ~900px at readable size | Entire story fits in one screen without zoom |
| Lifecycle walkthrough + spatial architecture | Pure scenario toggle with no spatial map |

**Reference implementations:**
- `public/simulations/aws_direct_connect_topology_simulator.html` — large multi-zone topology
- `public/simulations/aws_ssm_patch_manager_interactive.html` — lifecycle + staggered patching topology

## Core Principle

```
No page scroll for the diagram. Scroll inside sidebars only.
Explore spatial detail with pan/zoom on the canvas.
```

Simulators load inside an iframe (`SimulationPlayer`, `h-full`). The HTML file must fill the viewport (`h-full overflow-hidden`). If the diagram needs horizontal scroll or `min-w-[1000px]` on the page body, switch to canvas layout.

## Shell Anatomy

```
┌──────────────────────────────────────────────────────────────┐
│ Header (shrink-0) — title, optional badges                  │
├─────────────┬────────────────────────────┬─────────────────┤
│ LEFT ~360px │ CENTER flex-1              │ RIGHT ~360px    │
│ Steps       │ Canvas (zoom/pan)          │ Inspector       │
│             │                            │                 │
│ · progress  │ · SVG viewBox topology     │ · empty state   │
│ · title     │ · grid background          │ · title + body  │
│ · desc      │ · flow paths + packets     │ · close         │
│ · insight   │ · zoom +/- / 1:1           │                 │
│ · metrics*  │ · click nodes → inspector  │                 │
│ · prev/next │                            │                 │
└─────────────┴────────────────────────────┴─────────────────┘
* optional: uptime bar, scenario badge, etc.
```

**Column order is fixed:** steps **left**, canvas **center**, inspector **right**. Do not put the inspector above the diagram or stack steps above the canvas for topology simulators.

## HTML Skeleton

```html
<html lang="vi" class="h-full">
<body class="h-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden">

  <header class="shrink-0 border-b border-slate-800 ...">...</header>

  <main class="flex-1 flex overflow-hidden p-4 gap-4 min-h-0">

    <!-- LEFT: steps -->
    <aside class="w-[360px] shrink-0 flex flex-col ... overflow-hidden">
      <div class="flex-1 overflow-y-auto">...</div>
      <div class="shrink-0 border-t ...">
        <button id="btn-prev">...</button>
        <button id="btn-next">...</button>
      </div>
    </aside>

    <!-- CENTER: canvas -->
    <section class="flex-1 min-w-0 relative overflow-hidden bg-grid ...">
      <div class="absolute top-3 right-3 z-10"><!-- zoom controls --></div>
      <div id="svg-container" class="absolute inset-0 overflow-hidden">
        <svg viewBox="0 0 1280 720">
          <g id="zoom-pan-group"><!-- topology --></g>
        </svg>
      </div>
    </section>

    <!-- RIGHT: inspector -->
    <aside class="w-[360px] shrink-0 flex flex-col ... overflow-hidden">
      <div id="inspector-empty">...</div>
      <div id="inspector-content" class="hidden flex-1 overflow-y-auto">...</div>
    </aside>

  </main>
</body>
</html>
```

Required CSS classes on `html` and `body`:
- `h-full` on both
- `overflow-hidden` on `body`
- `min-h-0` on flex children that should shrink inside the iframe

## Left Panel Contract

| Element | ID pattern | Notes |
|---|---|---|
| Progress strip | `#progress-bar` | One segment per step; fill completed steps |
| Step counter | `#step-counter` | `Bước N / Total` |
| Title | `#step-title` | Official step name |
| Description | `#step-description` | What changed architecturally |
| Insight callout | `#step-insight` | Exam tip, anti-pattern, or "why it matters" |
| Optional metric | `#uptime-value`, etc. | Only when the story has a measurable teaching point |
| Navigation | `#btn-prev`, `#btn-next` | Prev disabled at 0; Next → "Hoàn tất" at last step |

Keep step copy in `ARCHITECTURE_STEPS[]`. `renderStep(index)` updates text only — no business logic in button handlers beyond index +/- 1.

## Center Canvas Contract

### Visual
- Dark slate canvas (`bg-slate-900/60`, `bg-grid`)
- Single SVG with fixed `viewBox` (e.g. `0 0 1280 720`)
- All zones, nodes, labels, and flow paths live inside `#zoom-pan-group`
- Floating zoom controls top-right (`data-action="zoom"`, `data-action="reset-zoom"`)

### Interaction
| Input | Behavior |
|---|---|
| Wheel on canvas | Zoom in/out |
| Drag on empty canvas | Pan |
| Drag starting on `[data-component]` | Select node, do **not** pan |
| Click `[data-component]` | Open inspector on the right |
| Zoom buttons | ±0.1 scale; reset to default scale + pan |

### SVG nodes
```html
<g id="node-run-command" data-component="run_command" class="interactive-node">
  <rect data-role="node-bg" x="..." y="..." rx="10" .../>
  <image href="/icons/aws/..." x="..." width="28" height="28"/>
  <text x="..." y="...">Run Command</text>
</g>
```

- `data-component` — key into `COMPONENT_DETAILS`
- `data-role="node-bg"` — stroke target for hover/selection
- `class="interactive-node"` — pointer cursor + hover stroke
- `class="node-selected"` — applied when inspector shows that component

### Flow paths
- Draw **base** paths (muted, always visible) and **active** paths (dashed `.active-route`, toggled per step)
- Prefer **fixed SVG coordinates** in the viewBox — not `getBoundingClientRect()` over HTML divs
- Optional packet animation: `<circle>` + `path.getPointAtLength()` along active path
- Update path `d` only when the active target changes (e.g. Group-A vs Group-B)

## Right Panel Contract

| State | Visible |
|---|---|
| Idle | `#inspector-empty` — prompt to click a canvas node |
| Active | `#inspector-content` — `#inspector-title`, `#inspector-desc` |

Inspector shows **deep technical detail** that would clutter the canvas. Keep canvas labels short (service name, tag, status badge).

Do not duplicate the step description in the inspector. Steps = narrative progression; inspector = component reference.

## Zoom/Pan Implementation

```js
let scale = 0.72;
let panX = 20;
let panY = 10;

function applyTransform() {
  document.getElementById("zoom-pan-group")
    .setAttribute("transform", `translate(${panX}, ${panY}) scale(${scale})`);
}

function zoomCanvas(delta) {
  scale = Math.max(0.35, Math.min(scale + delta, 2.2));
  applyTransform();
}

// mousedown on #svg-container: start pan unless target.closest("[data-component]")
// wheel on #svg-container: preventDefault + zoomCanvas(±0.06)
```

Default scale should fit the full viewBox in a typical laptop iframe without horizontal page scroll. Tune `scale`, `panX`, `panY` per simulator.

## Data Integration

```js
const ARCHITECTURE_STEPS = [
  {
    title: "...",
    description: "...",
    insight: "...",
    states: {
      flowAdmin: false,
      flowRunPm: true,
      groupA: "installing",
      activeEc2Group: "a",  // drives path-pm-ec2 target
      highlightBaseline: "group-a"
    }
  }
];

function renderStep(index) {
  const { states: s } = ARCHITECTURE_STEPS[index];
  updateStepPanel(index);
  updateSvgNodes(s);
  updateFlowPaths(s);
  applyFlowVisuals(s);
}
```

`states` keys are **semantic** (`rebooting`, `open`, `lookup`) — not CSS class names. Helper functions map state → SVG attributes (`stroke`, `opacity`, `fill`) and path visibility.

## Layout vs Other Project Patterns

| Pattern | File example | Shell |
|---|---|---|
| **Canvas layout** | `aws_direct_connect_topology_simulator.html`, `aws_ssm_patch_manager_interactive.html` | Left steps · center zoom SVG · right inspector |
| Flow canvas | `aws_ldap_flow_interactive.html` | Left scenarios · center fixed SVG (no zoom) · right inspector |
| Stacked walkthrough | `aws_mgn_interactive.html` | Steps + inspector row, diagram scrolls below — legacy; prefer canvas for new topology work |

When adding a **new** topology or lifecycle simulator, default to **canvas layout** unless the diagram is a single horizontal lane with ≤5 nodes.

## Anti-Patterns

| Do not | Why |
|---|---|
| `min-h-screen` + vertical page scroll for the diagram | Breaks iframe player; learner loses spatial context |
| `overflow-x-auto` wrapper around the whole diagram | Page scroll ≠ canvas explore; use zoom instead |
| Inspector on the left, steps on the right | Breaks project convention and Direct Connect parity |
| Steps above canvas in a tall scrolling page | Forces scroll to see topology on laptop screens |
| HTML flex columns + dynamic SVG overlay via `getBoundingClientRect` | Fragile on resize/zoom; use fixed viewBox coordinates |
| Pan starting on clickable nodes | Fights selection; guard `mousedown` with `closest("[data-component]")` |
| Inline `onclick` on nodes | Use delegated click on `data-component` |

## Completion Checklist

- [ ] `html` + `body` are `h-full`; body is `overflow-hidden`
- [ ] Three columns: steps left, canvas center, inspector right
- [ ] Canvas pan/zoom works; diagram readable at default zoom without page scroll
- [ ] Every teachable component has `data-component` + `COMPONENT_DETAILS` entry
- [ ] `renderStep()` drives SVG state; no scattered step indexes in handlers
- [ ] Opens correctly in iframe (`/s/[slug]/play`) and standalone (`/simulations/...html`)
- [ ] `npm run validate` passes
