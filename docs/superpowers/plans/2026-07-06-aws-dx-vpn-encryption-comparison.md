# AWS DX VPN Encryption Comparison Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new interactive simulator that compares Direct Connect-only Private VIF access with classic Site-to-Site VPN over Direct Connect using a Public VIF.

**Architecture:** Add one self-contained HTML simulator under `public/simulations` and one catalog entry in `data/simulations.ts`. The simulator uses data-first step definitions, centralized component details, side-by-side lanes, and a right inspector.

**Tech Stack:** Static HTML, Tailwind CDN, vanilla JavaScript, existing Next.js manifest validation.

---

### Task 1: Static Simulator

**Files:**
- Create: `public/simulations/aws_dx_vpn_encryption_comparison.html`

- [ ] **Step 1: Define content data first**

Create `ARCHITECTURE_STEPS` and `COMPONENT_DETAILS` in the HTML script. Include six steps: requirement, dx-only, private-vif-limit, vpn-over-dx, route-employees, exam-takeaway.

- [ ] **Step 2: Build side-by-side lanes**

Create two lanes in one canvas:
- DX only: Employee Laptop -> Corporate Network -> Direct Connect -> Private VIF -> VPC Private EC2.
- VPN over DX: Employee Laptop -> Corporate Network / Customer Gateway -> IPsec tunnel -> Direct Connect Public VIF -> AWS public Site-to-Site VPN endpoint -> VPC Private EC2.

- [ ] **Step 3: Implement render function**

Implement `renderStep(index)` to update text, progress, active route classes, lane emphasis, encryption badge, BGP badge, and selected inspector state.

- [ ] **Step 4: Implement interactions**

Use delegated click handlers for `[data-component]`, previous/next buttons, and step buttons. No inline business logic.

### Task 2: Catalog Entry

**Files:**
- Modify: `data/simulations.ts`

- [ ] **Step 1: Add manifest item**

Add slug `aws-dx-vpn-encryption-comparison`, title `Direct Connect vs VPN over DX — Encryption Path`, domain `networking`, difficulty `advanced`, and `htmlPath` `/simulations/aws_dx_vpn_encryption_comparison.html`.

### Task 3: Verification

**Files:**
- Verify: `public/simulations/aws_dx_vpn_encryption_comparison.html`
- Verify: `data/simulations.ts`

- [ ] **Step 1: Run manifest validation**

Run: `npm run validate`
Expected: command exits 0.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: command exits 0.
