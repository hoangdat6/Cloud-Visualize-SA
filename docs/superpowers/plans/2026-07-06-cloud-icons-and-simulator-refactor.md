# Cloud Icon Library & Simulator Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable cloud icon library and refactor the two current simulators to use clearer data-driven state and consistent icon-ready visuals.

**Architecture:** Store official/curated SVG icons under `public/icons`, expose stable icon metadata through `data/iconCatalog.ts`, document source terms in `docs/icon-sources.md`, and refactor standalone simulator HTML without introducing runtime bundling dependencies.

**Tech Stack:** Next.js manifest/catalog TypeScript, static SVG assets, standalone HTML + Tailwind CDN + vanilla JavaScript.

---

## File Map

| File | Responsibility |
|---|---|
| `public/icons/` | Static provider icon assets. |
| `data/iconCatalog.ts` | Stable service/provider icon mapping for app and simulator authors. |
| `docs/icon-sources.md` | Source URLs, access dates, and usage rules. |
| `.cursor/skills/building-cloud-simulators/SKILL.md` | Require official icon policy for future simulator work. |
| `.cursor/skills/building-cloud-simulators/STYLE_GUIDE.md` | Visual rules for using provider icons. |
| `public/simulations/aws_direct_connect_topology_simulator.html` | Direct Connect simulator refactor. |
| `public/simulations/aws_mgn_interactive.html` | MGN simulator cleanup and icon-ready cards. |

---

### Task 1: Create Icon Asset Library

**Files:**
- Create/modify: `public/icons/`
- Create: `docs/icon-sources.md`

- [ ] **Step 1:** Create provider directories:

```bash
mkdir -p public/icons/{aws,azure,gcp,third-party/kubernetes,third-party/cisco}
```

- [ ] **Step 2:** Download official/curated source packages where direct download is available:

```bash
mkdir -p /tmp/cloudviz-icons
curl -L "https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V23.zip" -o /tmp/cloudviz-icons/azure.zip
curl -L "https://services.google.com/fh/files/misc/core-products-icons.zip" -o /tmp/cloudviz-icons/gcp-core.zip
curl -L "https://services.google.com/fh/files/misc/category-icons.zip" -o /tmp/cloudviz-icons/gcp-category.zip
```

AWS package must be obtained from `https://aws.amazon.com/architecture/icons/` or a current official package URL discovered during implementation. If direct download cannot be automated, document the blocker and proceed with catalog placeholders for AWS icons used by the current simulators.

- [ ] **Step 3:** Extract only SVG files into provider directories. Preserve enough folder/name context to identify services.

- [ ] **Step 4:** For Kubernetes, copy SVG icons from the official `kubernetes/community` icon set or download only the needed SVGs.

- [ ] **Step 5:** For Cisco, include only if a direct downloadable SVG or acceptable editable format is available without violating terms. Otherwise document Cisco as "source approved, asset ingestion deferred".

- [ ] **Step 6:** Create `docs/icon-sources.md` with source URL, access date, usage terms summary, and ingestion status for every provider.

**Verify:** `rg -n "__MACOSX|\\.png|\\.eps|\\.pptx|\\.vss|\\.vsdx" public/icons` returns no unwanted binary/source package files.

---

### Task 2: Create Icon Catalog

**Files:**
- Create: `data/iconCatalog.ts`

- [ ] **Step 1:** Define catalog types:

```ts
export type IconProvider = "aws" | "azure" | "gcp" | "kubernetes" | "cisco";

export interface CloudIcon {
  key: string;
  provider: IconProvider;
  label: string;
  path: string;
  source: string;
}
```

- [ ] **Step 2:** Add an initial curated mapping for icons needed by current simulators:
  - AWS: Direct Connect, Transit Gateway, VPC, S3, EC2, EBS, Application Migration Service if available.
  - Kubernetes: placeholder entries only if assets were ingested.
  - Cisco: CE router/firewall only if assets were ingested.

- [ ] **Step 3:** Export a helper:

```ts
export function getIcon(key: string): CloudIcon | undefined {
  return cloudIcons.find((icon) => icon.key === key);
}
```

**Verify:** `npm run validate` still passes.

---

### Task 3: Update Simulator Skill and Style Guide

**Files:**
- Modify: `.cursor/skills/building-cloud-simulators/SKILL.md`
- Modify: `.cursor/skills/building-cloud-simulators/STYLE_GUIDE.md`

- [ ] **Step 1:** Add icon policy to `SKILL.md`: official/curated icons, documented source, no icon-only meaning.
- [ ] **Step 2:** Add icon card pattern to `STYLE_GUIDE.md`: `img`/`svg` slot + label + fallback.
- [ ] **Step 3:** Mention `data/iconCatalog.ts` and `docs/icon-sources.md` as references.

**Verify:** Read both files and confirm references are one level deep and skill remains concise.

---

### Task 4: Refactor Direct Connect Simulator

**Files:**
- Modify: `public/simulations/aws_direct_connect_topology_simulator.html`

- [ ] **Step 1:** Add `data-action`, `data-scenario`, `data-node`, and `data-tab` attributes to controls/nodes while preserving current UI.
- [ ] **Step 2:** Replace inline `onclick` and `onkeypress` handlers with delegated event listeners.
- [ ] **Step 3:** Add `TRAFFIC_SCENARIOS` data object for private/transit/public route config.
- [ ] **Step 4:** Update `runSimulation(type)` to read from `TRAFFIC_SCENARIOS`.
- [ ] **Step 5:** Add icon-ready labels for AWS services and network devices where catalog assets exist. Keep existing SVG shapes as fallback.
- [ ] **Step 6:** Disable or clearly mark Gemini AI actions when `apiKey` is empty.

**Verify:** Private, Transit, and Public VIF flows still animate and inspector updates during packet movement.

---

### Task 5: Refactor MGN Simulator

**Files:**
- Modify: `public/simulations/aws_mgn_interactive.html`

- [ ] **Step 1:** Remove unused `camel()` and `injectPackets()` if no references remain.
- [ ] **Step 2:** Add `STATE_SCHEMA` near `ARCHITECTURE_STEPS`.
- [ ] **Step 3:** Add lightweight icon slots to AWS service cards using static paths only when assets exist.
- [ ] **Step 4:** Keep `ARCHITECTURE_STEPS` as the source of truth for lifecycle state.
- [ ] **Step 5:** Confirm TCP 443 and TCP 1500 SVG flow behavior remains unchanged.

**Verify:** Steps 1-9 render, Test/Cutover EC2 cards appear in correct steps, and data/control packet animations can run together.

---

### Task 6: Final Validation

**Files:** read-only validation

- [ ] **Step 1:** Run `npm run validate`.
- [ ] **Step 2:** Run `npm run build`.
- [ ] **Step 3:** Summarize any icon source that could not be ingested automatically.

**Expected:** Both commands exit 0.
