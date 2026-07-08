# Simulation Blueprint

Use this before implementing or significantly editing a simulator.

## Metadata

```yaml
slug:
title:
cloud:
domain:
difficulty:
htmlPath:
sourceFiles:
  - public/simulations/...
manifestFile: data/simulations.ts
```

## Learning Contract

- Audience:
- Prerequisites:
- Learning objectives:
  - ...
- Out of scope:
  - ...

## Official Sources

| Claim Area | Official Source URL | Access Date | Notes |
|---|---|---|---|
| Service overview |  |  |  |
| Architecture components |  |  |  |
| Network ports/endpoints |  |  |  |
| IAM/security |  |  |  |
| Quotas/limits |  |  |  |
| Lifecycle/operations |  |  |  |

Every technical claim in the simulator must map to this table or be marked as a project simplification.

## Coverage Matrix

| Category | Covered? | Simulator Step/Scenario | Notes |
|---|---:|---|---|
| Core happy path |  |  |  |
| Common variants |  |  |  |
| Failure or blocked states |  |  |  |
| Networking paths and ports |  |  |  |
| IAM/security boundaries |  |  |  |
| Data plane vs control plane |  |  |  |
| Regional/account boundaries |  |  |  |
| Quotas or service limits |  |  |  |
| Cost-relevant resources |  |  |  |
| Cleanup/finalization |  |  |  |

## Components

| Component ID | Display Name | Role | Source Claim | Visual Treatment |
|---|---|---|---|---|
|  |  |  |  |  |

Use stable kebab/snake IDs that can be reused in `COMPONENT_DETAILS`, DOM IDs, and state maps.

## Lifecycle Steps

```js
const SIMULATION_STEPS = [
  {
    id: "",
    title: "",
    description: "",
    insight: "",
    sourceClaims: [],
    states: {}
  }
];
```

For each step, define:

- What changed from the previous step?
- Which components are active, inactive, created, terminated, or hidden?
- Which control-plane and data-plane paths are active?
- What should the learner click to inspect?
- Which source claim justifies the step?

## State Schema

Document the allowed state values before implementation:

```js
const STATE_SCHEMA = {
  controlPlane: ["inactive", "active"],
  dataPlane: ["inactive", "light", "heavy"],
  target: ["empty", "provisioning", "active", "terminated"]
};
```

Rules:

- Add new state values only when a step needs a distinct visual or behavioral meaning.
- Keep state names semantic, not visual. Use `syncing`, not `purple`.
- Render functions translate semantic state into classes, labels, and animations.

## Rendering Plan

- Layout model: `canvas` (see `CANVAS_LAYOUT.md`) | `flow` | `stacked`
- Shell columns: steps left · canvas center · inspector right (canvas layout)
- Major regions:
- SVG viewBox size and coordinate map:
- SVG paths / animated flows:
- Inspector behavior:
- Stepper behavior:
- Zoom/pan defaults (scale, panX, panY):
- Responsive constraints: `h-full overflow-hidden` — no page scroll for diagram in iframe player
- Reused patterns from existing simulator:

## Verification Plan

- [ ] Open direct HTML path.
- [ ] Click through every step/scenario.
- [ ] Verify every visible flow maps to a documented architecture flow.
- [ ] Verify every clickable component has useful inspector text.
- [ ] Update `data/simulations.ts`.
- [ ] Run `npm run validate`.
- [ ] Run `npm run build`.
