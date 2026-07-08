# AWS MGN Interactive Simulation — Design Spec

**Date:** 2026-07-06  
**Status:** Approved  
**File:** `public/simulations/aws_mgn_interactive.html`

## Goal

Cập nhật simulation MGN để phản ánh chính xác kiến trúc AWS Application Migration Service: 9 bước lifecycle, control plane vs data plane, port 443/1500, đủ component.

## Approach

Layout 3 tầng trong một sơ đồ (Approach B):
1. **Control plane strip** — MGN Service, IAM/Replication Settings, S3
2. **Data plane** — Source Agent → TCP 1500 → Replication Server → Staging EBS; song song TCP 443 Agent↔MGN
3. **Target area** — Launch Settings, Test EC2, Cutover EC2, Conversion Server

## Lifecycle (9 steps)

| # | Step |
|---|------|
| 1 | Cài Agent & cấu hình (IAM, Replication Settings) |
| 2 | Kiến trúc I/O Block layer |
| 3 | Initial Sync (đọc full disk → TCP 1500) |
| 4 | Continuous Delta Sync |
| 5 | Launch Test Instance |
| 6 | Launch Cutover Instance |
| 7 | Snapshot + Conversion (Conversion Server, S3) |
| 8 | Finalize Cutover |
| 9 | Disconnect & Cleanup |

## Corrections from current version

- Data replication: **TCP 1500** (not 443)
- Control/orchestration: **TCP 443**
- Agent intercepts block I/O path; writes still reach disk
- Remove Snowball reference
- Staging EBS type from Replication Settings (gp3/st1)
- Separate Test EC2 vs Cutover EC2
- Separate Conversion Server from Replication Server

## New interactive components

`mgn_service`, `iam_settings`, `launch_settings`, `network_control`, `network_data`, `conversion_server`, `s3`, `test_ec2`, `cutover_ec2` (+ updated existing)

## Out of scope

- Splitting HTML into multiple files
- Automated browser tests
- Thumbnail asset

## Catalog

Register entry in `data/simulations.ts` with slug `aws-mgn`.
