# AWS DX VPN Encryption Comparison Design

## Metadata

```yaml
slug: aws-dx-vpn-encryption-comparison
title: Direct Connect vs VPN over DX — Encryption Path
cloud: aws
domain: networking
difficulty: advanced
htmlPath: /simulations/aws_dx_vpn_encryption_comparison.html
sourceFiles:
  - public/simulations/aws_dx_vpn_encryption_comparison.html
manifestFile: data/simulations.ts
```

## Learning Contract

- Audience: AWS certification learners who need to distinguish Direct Connect private reachability from encrypted Site-to-Site VPN over Direct Connect.
- Prerequisites: VPC basics, private subnet, Direct Connect, virtual interfaces, Site-to-Site VPN, BGP.
- Learning objectives:
  - Compare Direct Connect-only access through a Private VIF with VPN over Direct Connect through a Public VIF.
  - Explain why Direct Connect alone gives consistent private connectivity but does not add IPsec encryption.
  - Show that the classic AWS-managed VPN over DX exam pattern reaches AWS public VPN endpoints through a Public VIF.
  - Trace employee traffic after the corporate network routes it into the IPsec tunnel.
- Out of scope:
  - Private IP VPN over Transit VIF.
  - MACsec on Direct Connect dedicated connections.
  - HA tunnel failover and detailed device configuration.

## Official Sources

| Claim Area | Official Source URL | Access Date | Notes |
|---|---|---|---|
| Direct Connect + IPsec VPN pattern | https://docs.aws.amazon.com/wellarchitected/latest/hybrid-networking-lens/aws-direct-connect-and-ipsec-vpn.html | 2026-07-06 | IPsec VPN combines end-to-end secure IPsec with low latency and consistent Direct Connect experience. |
| Public VIF for public VPN endpoints | https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/aws-direct-connect-site-to-site-vpn.html | 2026-07-06 | Public VIF establishes dedicated connectivity to public AWS resources such as Site-to-Site VPN endpoints. |
| VIF types | https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html | 2026-07-06 | Private VIF accesses Amazon VPC using private IP addresses; Public VIF accesses AWS public services using public IP addresses. |
| Public VIF advertised prefixes | https://docs.aws.amazon.com/directconnect/latest/UserGuide/create-public-vif.html | 2026-07-06 | Public VIF uses BGP and route filter prefixes for destinations advertised over the VIF. |

## Coverage Matrix

| Category | Covered? | Simulator Step/Scenario | Notes |
|---|---:|---|---|
| Core happy path | Yes | VPN over DX | Employee traffic enters IPsec tunnel and reaches EC2 private subnet. |
| Common variants | Yes | DX only | Direct private reachability without IPsec. |
| Failure or blocked states | Yes | Private VIF does not reach VPN endpoint | Conceptual blocked state, not a runtime failure. |
| Networking paths and ports | Partial | All steps | Shows BGP, VIF, IPsec conceptually; does not model UDP 500/4500. |
| IAM/security boundaries | Yes | Requirement and VPN over DX | Focuses on encryption boundary. |
| Data plane vs control plane | Partial | Route employee traffic | Shows BGP route exchange and encrypted data path. |
| Regional/account boundaries | No | N/A | Single VPC teaching scenario. |
| Quotas or service limits | No | N/A | Not needed for exam concept. |
| Cost-relevant resources | No | N/A | Not part of the asked comparison. |
| Cleanup/finalization | No | N/A | No lifecycle resource teardown. |

## Components

| Component ID | Display Name | Role | Source Claim | Visual Treatment |
|---|---|---|---|---|
| employee_laptop | Employee Laptop | Starts proprietary app traffic | Project scenario | Client card in both lanes |
| corporate_network | Corporate Network / CGW | Routes traffic to DX or VPN tunnel | VPN user guide, DX docs | On-prem node |
| direct_connect | AWS Direct Connect | Dedicated consistent path | DX docs | Shared corridor |
| private_vif | Private VIF | Private IP access to VPC resources | DX VIF docs | Blue lane node |
| public_vif | Public VIF | Access to AWS public VPN endpoint | DX + VPN docs | Orange lane node |
| aws_vpn_endpoint | AWS Site-to-Site VPN Endpoint | Public AWS VPN endpoint for IPsec tunnel | AWS whitepaper | Public endpoint node outside VPC |
| vpc_private_ec2 | Private EC2 in VPC | Target legacy app | Project scenario | AWS VPC target |

## Lifecycle Steps

```js
const SIMULATION_STEPS = [
  { id: "requirement", title: "Requirement", states: { dxOnly: "dim", vpn: "dim", encrypted: false } },
  { id: "dx-only", title: "DX only", states: { dxOnly: "active", vpn: "dim", encrypted: false } },
  { id: "private-vif-limit", title: "Why Private VIF is not enough", states: { dxOnly: "blocked", vpn: "dim", encrypted: false } },
  { id: "vpn-over-dx", title: "VPN over DX", states: { dxOnly: "dim", vpn: "active", encrypted: true } },
  { id: "route-employees", title: "Route employee traffic into tunnel", states: { dxOnly: "dim", vpn: "active", encrypted: true, bgp: true } },
  { id: "exam-takeaway", title: "Exam takeaway", states: { dxOnly: "compare", vpn: "compare", encrypted: true } }
];
```

## State Schema

```js
const STATE_SCHEMA = {
  lane: ["dim", "active", "blocked", "compare"],
  encrypted: [false, true],
  bgp: [false, true]
};
```

## Rendering Plan

- Layout model: side-by-side flow canvas with left steps, center comparison canvas, right inspector.
- Major regions: On-premises, Direct Connect corridor, AWS public service edge, VPC private subnet.
- SVG/view: fixed HTML/SVG canvas inspired by `aws_saml_vs_oidc_flow_interactive.html`.
- Flows: muted base route for DX-only, animated blue route for direct private path, animated orange route for IPsec tunnel over Public VIF.
- Inspector: component details explain official role and exam trap.
- Stepper: six narrative steps with progress, previous/next, and click-to-select components.

## Verification Plan

- Open direct HTML path mentally/static review for missing IDs.
- Click through every step through DOM state functions.
- Verify every visible flow maps to documented architecture flow.
- Verify every clickable component has useful inspector text.
- Update `data/simulations.ts`.
- Run `npm run validate`.
- Run `npm run build`.
