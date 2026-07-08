# Cloud-Visualize-SA Simulator Style Guide

Use this to keep simulators visually consistent while allowing architecture-specific layouts.

## Baseline Structure

- Keep simulator HTML self-contained in `public/simulations/`.
- Use Tailwind CDN unless the project architecture changes.
- Avoid dependencies that require bundling inside the simulator HTML.
- Use a clear learning shell. For topology/lifecycle simulators, follow `CANVAS_LAYOUT.md`:
  - header (title)
  - **left:** step/scenario controls + progress
  - **center:** zoom/pan canvas (no page scroll for diagram)
  - **right:** inspector / technical detail
- Simpler flow-only simulators may use two-column shells (see `aws_ldap_flow_interactive.html`).

## Visual Language

- Default to the hand-drawn sketchnote style from `public/simulations/ki_n_tr_c_mgn_sketchnote_style.html` for all new simulators and for restyling existing simulators.
- Use a warm graph-paper background, handwritten typography, sketch borders, pastel highlight boxes, notebook callouts, small doodle accents, and high-contrast ink-like text.
- Avoid large plain-white panels. Most simulator sections should have a visible pastel fill from the sketchnote palette:
  - step/navigation panels: yellow or purple wash
  - inspector/detail panels: blue wash
  - active/success states: green wash
  - warnings/blocked states: red wash
  - AWS/service/control regions: orange wash
- Load the same handwriting fonts unless the simulator must be fully offline:
  - `Pangolin`
  - `Klee One`
- Use the sketchnote palette as the baseline:
  - paper: `#fdfaf3`
  - ink: `#333333`
  - purple section labels: `#f4f0ff` / `#a89fcf`
  - blue info boxes: `#f0f7fd` / `#9fbce4`
  - yellow notes: `#fffcf0` / `#e6d38e`
  - green success: `#f0fdf4` / `#a3e6b5`
  - red warning: `#fdeaea` / `#e68a8a`
- Preserve official cloud color meaning only as accents inside the sketchnote palette:
  - AWS orange for service/control emphasis
  - blue for networking/data processing
  - purple for logical overlays, replication, or transit paths
  - green for healthy/live states
  - amber/orange for provisioning, warnings, or heavy activity
  - gray pencil/ink for inactive infrastructure
- Prefer hand-drawn colored cards and labels over dark glass/neon panels or plain white boxes.
- Use badges for ports, lifecycle status, and active states.
- Keep labels short in the diagram; put deep explanations in the inspector.

Sketchnote utility pattern:

```html
<style>
  :root {
    --bg-paper: #fdfaf3;
    --grid-line: #efede7;
    --grid-line-vertical: #f0ebe1;
    --text-main: #333333;
    --box-yellow-bg: #fffcf0;
    --box-yellow-border: #e6d38e;
  }
  body {
    font-family: 'Pangolin', 'Klee One', cursive, sans-serif;
    background-color: var(--bg-paper);
    color: var(--text-main);
    background-image:
      linear-gradient(var(--grid-line) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-line-vertical) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  .hd-border {
    border: 2px solid var(--text-main);
    border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  }
</style>
```

Avoid:

- Dark slate/neon dashboard shells as the default visual system.
- Glassmorphism cards as the primary simulator style.
- Treating `aws_direct_connect_topology_simulator.html` or other dark simulators as the visual baseline when creating new work.
- Dropping the sketchnote style because canvas layout is used; canvas layout controls structure, not visual theme.

## Provider Icons

- Use `data/iconCatalog.ts` for curated icon keys and paths.
- Use `data/awsIconManifest.ts` for the full AWS icon catalog (766 icons, SVG canonical size).
- Use `data/ciscoIconManifest.ts` for the full Cisco icon catalog (SAFE + classic topology).
- Use `data/brandIconManifest.ts` for software/product brand icons (Simple Icons).
- Generic roles (user, workstation, server) → Cisco topology or Kubernetes, not brand logos.
- Brand logos (Go, Nginx, …) → only when the diagram refers to that specific product.
- Check `docs/icon-sources.md` before adding or refreshing icon assets.
- Use official or clearly licensed SVG icons only.
- Do not crop, flip, rotate, distort, recolor, or remove notices from provider icons.
- Always keep a text label near the icon. The simulator must still teach correctly if the icon is missing.

Preferred card pattern:

```html
<div class="service-card">
  <img src="/icons/provider/path.svg" alt="" class="h-6 w-6" />
  <span>Official Service Name</span>
</div>
```

If an icon is unavailable, keep the same card layout and use a simple inline SVG fallback or text badge.

## Topology Flows

Use integrated SVG paths for flows that cross regions, accounts, networks, or zones.

Keep the sketchnote visual theme, but use a **system-design visualizer line grammar** for topology clarity:

- Place nodes on a clear grid with consistent lanes or columns.
- Prefer orthogonal or shallow-curved connectors over decorative wandering paths.
- Use one base connector and one active connector per relationship:
  - base: neutral pencil/gray, thin, low opacity
  - active: service accent color, dashed, arrow marker, slightly thicker
- Keep connector labels close to the line midpoint and outside node boxes.
- Use dashed arrows for async/control/route propagation and solid arrows for primary request/data paths.
- Avoid thick dark pipes unless they represent physical media; most simulator flows should look like system-design diagram lines.
- Keep line crossings rare. If unavoidable, use a lane split or labeled jump instead of crossing through node text.

Preferred pattern:

```html
<svg class="absolute inset-0 pointer-events-none">
  <path id="path-data-base" class="flow-base" />
  <path id="path-data-active" class="flow-active active-route hidden" />
  <circle id="anim-packet-data" />
</svg>
```

Rules:

- Lines should run through the topology, not as detached bars below the diagram.
- Use thick base paths only for physical/logical pipes. Use visualizer-style `flow-base`/`flow-active` lines for most architecture relationships.
- Label paths with protocol/port when relevant.
- Animate only flows that are active in the current state.
- Keep control plane and data plane visually distinct.

Reference styles:

- Direct Connect simulator: thick SVG route pipes, active dashed route, packet movement.
- MGN simulator: DC to Network to AWS overlay, separate TCP 443 and TCP 1500 paths.

## Interaction Pattern

- Every important component should be clickable with `data-component`.
- Keep `COMPONENT_DETAILS` centralized.
- Use event delegation for clicks.
- Do not attach business logic to inline `onclick` handlers.
- Highlight selected components without changing layout.

## Step and State Pattern

- Define all steps in one array.
- Each step owns a semantic `states` object.
- `renderStep()` should translate state to DOM classes and text.
- Use helper functions for:
  - visibility
  - active/inactive styling
  - SVG geometry
  - packet animation
  - inspector updates

## Layout Patterns

### App shell (viewport)

| Shell | When | Reference |
|---|---|---|
| **Canvas layout** | Multi-zone topology, 6+ nodes, lifecycle + spatial map | `CANVAS_LAYOUT.md`, Direct Connect, SSM Patch Manager |
| **Flow canvas** | Single-lane protocol, few nodes, no zoom needed | LDAP, Kerberos |
| **Stacked walkthrough** | Legacy only — avoid for new topology work | MGN |

Canvas layout columns: **steps left · SVG canvas center · inspector right**. Full spec in `CANVAS_LAYOUT.md`.

### Diagram composition (inside SVG viewBox)

Choose the spatial model that matches the architecture:

- `3-column topology`: on-prem/customer, network corridor, cloud region.
- `layered control/data plane`: control strip above data path.
- `hub-and-spoke`: central routing/service hub with attachments.
- `lifecycle + zones`: maintenance windows, patch groups, fleet tiers (SSM Patch Manager).

Draw flow paths inside the same `viewBox`. Use fixed coordinates — not HTML layout + `getBoundingClientRect` when canvas layout is used.

## Text Quality

- Use Vietnamese for learner-facing text unless the simulator is explicitly English.
- Keep official AWS service names in English.
- Explain what matters architecturally, not every UI detail.
- Avoid vague labels like "server", "service", or "data" when the official term is known.

## Completion Review

- [ ] Style matches at least one existing simulator intentionally.
- [ ] The most important data/control flows are visible without clicking.
- [ ] Inspector explains details that would clutter the diagram.
- [ ] Animations teach architecture, not decoration.
- [ ] Canvas layout: diagram fits at default zoom without page scroll; pan/zoom works in iframe player.
- [ ] Non-canvas simulators: readable around 1000px width without broken layout.
