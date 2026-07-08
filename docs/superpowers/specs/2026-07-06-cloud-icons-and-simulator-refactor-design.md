# Cloud Icon Library & Simulator Refactor — Design Spec

**Date:** 2026-07-06  
**Status:** Approved  
**Scope:** Download curated official icon sets, document source/usage rules, and refactor the two existing simulators.

## Goals

- Build a reusable icon asset library for Cloud-Visualize-SA simulators.
- Start with official AWS, Azure, Google Cloud icon sets and curated third-party sources with clear usage terms.
- Refactor `aws_direct_connect_topology_simulator.html` and `aws_mgn_interactive.html` toward the simulator skill rules: docs-first, data-first, centralized state, no ad hoc lifecycle logic.
- Use icons as visual aids, not as the only source of meaning. Every icon must keep a nearby text label.

## Icon Policy

### Providers

| Provider | Source | Usage Notes |
|---|---|---|
| AWS | `https://aws.amazon.com/architecture/icons/` | AWS allows customers/partners to use toolkits/assets for architecture diagrams; packages update quarterly. Use current official package where available. |
| Azure | `https://learn.microsoft.com/en-us/azure/architecture/icons/` | Microsoft permits use in architecture diagrams, training materials, and docs. Do not crop, flip, rotate, distort, or use Microsoft icons for non-Microsoft products. |
| Google Cloud | `https://cloud.google.com/icons` | Official SVG/PNG product icons for diagrams and technical documentation. Prefer the 2025+ icon system over legacy console icons. |
| Kubernetes | `https://github.com/kubernetes/community/tree/master/icons` | Apache-2.0 or CC-BY-4.0; Kubernetes logo trademark rules still apply. |
| Cisco | `https://www.cisco.com/c/en/us/about/brand-center/network-topology-icons.html` | Cisco says topology icons may be used freely but not altered. |
| Palo Alto Networks | Press kit / stencil pages | Treat as restricted. Do not include until usage terms are acceptable for this repo. |

### Storage

Use this structure:

```text
public/icons/
  aws/
  azure/
  gcp/
  third-party/
    kubernetes/
    cisco/
data/iconCatalog.ts
docs/icon-sources.md
```

Only keep SVG assets by default. Exclude PNG, EPS, PPTX, Visio, `__MACOSX`, and duplicate size variants unless a source has no SVG.

## Simulator Refactor Design

### Direct Connect

Current risks:

- Many inline `onclick` handlers.
- Scenario logic is hardcoded in `runSimulation()`.
- Node data exists in `nodeDB`, but route/scenario data is not similarly centralized.
- Gemini AI panel is out of scope for a static learning simulator unless an API key/config flow is added.

Refactor direction:

- Keep the existing dark topology style and SVG route paths.
- Add provider/service icon slots to key AWS services and network devices.
- Move scenario config into `TRAFFIC_SCENARIOS`.
- Replace inline handlers with event delegation and `data-*` attributes.
- Keep AI panel disabled or clearly marked unless configured.

### MGN

Current strengths:

- Uses `ARCHITECTURE_STEPS` with semantic `states`.
- Uses integrated SVG pipes for TCP 443 and TCP 1500.
- Uses centralized `COMPONENT_DETAILS`.

Refactor direction:

- Remove unused helpers.
- Add explicit state schema documentation near `ARCHITECTURE_STEPS`.
- Add icon slots for MGN Service, S3, EC2, EBS, Replication Agent where available.
- Keep TCP 443 and TCP 1500 labels textual; do not rely on icons for protocol meaning.

## Verification

- Direct HTML open works for both files.
- Every Direct Connect scenario runs.
- Every MGN lifecycle step renders.
- Catalog manifest remains valid.
- `npm run validate` passes.
- `npm run build` passes.
