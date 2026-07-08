---
name: building-cloud-simulators
description: Use when creating, editing, reviewing, or extending Cloud-Visualize-SA interactive cloud simulators, especially AWS simulations, lifecycle walkthroughs, topology visualizations, scenario flows, or files under public/simulations.
---

# Building Cloud Simulators

## Core Rule

Build simulators from verified architecture data first, UI second. Every lifecycle step, network port, service role, limit, and claim must trace to official docs or an explicit project decision before implementation.

## Required Workflow

1. Inspect current project patterns:
   - `public/simulations/*.html`
   - `data/simulations.ts`
   - `docs/06-quy-trinh-them-mo-phong.md`
   - existing specs/plans under `docs/superpowers/`
2. Research official docs before designing. For AWS, use `AWS_RESEARCH_CHECKLIST.md`.
3. Create or update a simulator blueprint before coding. Use `SIMULATION_BLUEPRINT.md`.
4. Inventory visual style from at least one relevant existing simulator. Use `STYLE_GUIDE.md`.
   - For visual styling, treat `public/simulations/ki_n_tr_c_mgn_sketchnote_style.html` as the default reference unless the user explicitly requests another style.
   - Keep simulator structure data-first, but render it with the sketchnote paper/hand-drawn theme described in `STYLE_GUIDE.md`.
5. Choose the shell layout. For topology or lifecycle diagrams with 6+ components, use `CANVAS_LAYOUT.md` (steps left · zoom canvas center · inspector right).
6. Check `docs/icon-sources.md` and `data/iconCatalog.ts` before adding provider icons.
7. Define lifecycle data and state transitions before writing DOM update logic.
8. Implement the self-contained HTML simulator and catalog entry.
9. Verify:
   - direct HTML opens without serious console errors
   - `/s/[slug]` and `/s/[slug]/play` route works inside iframe (`h-full`, no page scroll for diagram)
   - every scenario/step renders
   - canvas pan/zoom works when using canvas layout
   - `npm run validate` passes
   - `npm run build` passes unless the user explicitly skips it

## Non-Negotiables

- Do not rely on memory for cloud architecture claims. Cite official docs in the blueprint/spec.
- Do not treat "important use cases" as vibes. Fill the coverage matrix.
- Do not scatter lifecycle logic through inline handlers, markup, or unrelated conditionals.
- Do not copy visual style blindly if it carries technical debt. Preserve the look, improve the structure.
- Do not use the legacy dark/neon dashboard style as the default visual baseline for new or restyled simulators.
- Do not call a simulator accurate until every major claim has a source or is marked as a project simplification.
- Do not use provider icons as the only meaning carrier. Keep text labels and source-compliant icon usage.

## Data-First Implementation Pattern

Use explicit data structures:

```js
const SIMULATION_STEPS = [
  {
    id: "initial-sync",
    title: "Initial Sync",
    description: "...",
    sourceClaims: ["AWS User Guide: ..."],
    states: {
      dataPlane: "heavy",
      controlPlane: "active",
      staging: "syncing"
    }
  }
];

function renderStep(step) {
  updateText(step);
  updateTopology(step.states);
  updateInspector(step);
}
```

Prefer:
- stable component IDs
- centralized `COMPONENT_DETAILS`
- `states` objects per step
- pure-ish render/update functions
- SVG paths inside a fixed `viewBox` for canvas-layout simulators
- zoom/pan on `#zoom-pan-group` instead of page-level horizontal scroll
- official/curated provider icons from `data/iconCatalog.ts` when available

Avoid:
- inline `onclick` business logic
- duplicated state in classes and global flags
- hardcoded step indexes spread across functions
- unlabelled animations that do not map to a real architecture flow

## Required References

- `SIMULATION_BLUEPRINT.md`: reusable spec template.
- `AWS_RESEARCH_CHECKLIST.md`: official AWS documentation checklist.
- `STYLE_GUIDE.md`: Cloud-Visualize-SA simulator visual conventions.
- `CANVAS_LAYOUT.md`: zoom/pan shell — steps left, canvas center, inspector right.
- `docs/icon-sources.md`: provider icon sources, usage rules, and ingestion status.
- `data/iconCatalog.ts`: curated icon keys and paths.
- `data/awsIconManifest.ts`: full AWS icon catalog (auto-generated).
- `data/ciscoIconManifest.ts`: full Cisco icon catalog (auto-generated).
- `data/brandIconManifest.ts`: software/product brand icons from Simple Icons (auto-generated).

Read the relevant reference before editing simulator files.
