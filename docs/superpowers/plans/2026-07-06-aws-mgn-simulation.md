# AWS MGN Simulation Accuracy Update — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `aws_mgn_interactive.html` to accurate 9-step AWS MGN lifecycle with control/data plane separation and register in catalog.

**Architecture:** Single self-contained HTML file; 3-tier diagram layout; expanded JS state machine (`control443`, `data1500`, `testTarget`, `cutoverTarget`, etc.).

**Tech Stack:** HTML, Tailwind CDN, vanilla JS

**Spec:** `docs/superpowers/specs/2026-07-06-aws-mgn-simulation-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `public/simulations/aws_mgn_interactive.html` | Full simulation UI + logic |
| `data/simulations.ts` | Catalog manifest entry |

---

### Task 1: Rewrite diagram HTML structure

**Files:**
- Modify: `public/simulations/aws_mgn_interactive.html`

- [ ] **Step 1:** Add control plane strip (MGN Service, IAM, S3)
- [ ] **Step 2:** Split network into `network_control` (443) and `network_data` (1500)
- [ ] **Step 3:** Add Conversion Server in staging; Test EC2 + Cutover EC2 in target subnet
- [ ] **Step 4:** Set `min-w-[960px]` on diagram container

**Verify:** Open file in browser; all new boxes visible without JS errors.

---

### Task 2: Update COMPONENT_DETAILS and ARCHITECTURE_STEPS

**Files:**
- Modify: `public/simulations/aws_mgn_interactive.html` (script section)

- [ ] **Step 1:** Replace incorrect texts (agent, network, rep_server, staging_ebs)
- [ ] **Step 2:** Add 9 `ARCHITECTURE_STEPS` with new `states` object
- [ ] **Step 3:** Remove Snowball; document port 1500 vs 443

**Verify:** Console: `ARCHITECTURE_STEPS.length === 9`

---

### Task 3: Rewrite renderStep() state machine

**Files:**
- Modify: `public/simulations/aws_mgn_interactive.html`

- [ ] **Step 1:** Map `control443`, `data1500`, `mgnService`, `s3`, `conversionServer`
- [ ] **Step 2:** Map `testTarget` and `cutoverTarget` independently
- [ ] **Step 3:** Use event delegation for `.interactive-element` clicks
- [ ] **Step 4:** Update `selectComponent()` highlight rules for new components

**Verify:** Click through steps 1–9; lanes animate correctly per step.

---

### Task 4: Register catalog entry

**Files:**
- Modify: `data/simulations.ts`

- [ ] **Step 1:** Add `aws-mgn` simulation object after direct-connect entry

**Verify:** Run `npm run validate` in Cloud-Visualize-SA — exits 0.

---

### Task 5: Build validation

**Files:** (read-only check)

- [ ] **Step 1:** Run `cd Cloud-Visualize-SA && npm run validate`
- [ ] **Step 2:** Run `npm run build` — no type errors

**Expected:** Both commands succeed.
