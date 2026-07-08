# AWS Identity Flow Simulator Suite — Design Spec

**Date:** 2026-07-06  
**Status:** Approved for implementation  
**Scope:** Replace the broad identity federation overview simulator with four flow-first simulators.

## Goal

Split the previous broad identity simulator into four separate simulations so each one can teach a single internal flow in detail, using a dark interactive canvas similar to `aws_direct_connect_topology_simulator.html`.

## Suite

1. `aws-ldap-flow`
   - File: `public/simulations/aws_ldap_flow_interactive.html`
   - Focus: `App -> LDAP -> Directory Service`

2. `aws-ad-kerberos-flow`
   - File: `public/simulations/aws_ad_kerberos_flow_interactive.html`
   - Focus: `User -> AD/KDC -> TGT -> Service Ticket -> Service`

3. `aws-saml-vs-oidc-flow`
   - File: `public/simulations/aws_saml_vs_oidc_flow_interactive.html`
   - Focus: side-by-side comparison of `SAML` vs `OIDC`

4. `aws-cognito-identity-pool-flow`
   - File: `public/simulations/aws_cognito_identity_pool_flow_interactive.html`
   - Focus: `OIDC/SAML token -> Identity Pool -> STS -> IAM Role -> AWS Resource`

## Core Teaching Rule

The primary teaching unit is the **internal flow**, not the abstract concept.

Each simulator should answer:

- who starts the flow
- what artifact is exchanged next
- where trust is evaluated
- what the final outcome is
- what the flow is good for
- what the flow is not good for

## Visual Direction

All four simulations should use:

- dark canvas
- large central topology / flow map
- left sidebar for scenarios or steps
- right inspector/details panel
- animated SVG paths
- clickable nodes with technical explanation

Reference style:

- `public/simulations/aws_direct_connect_topology_simulator.html`

## Simulator Breakdown

### 1. LDAP Flow

Teaching focus:

- LDAP is a protocol between client/app and directory service
- directory stores users/groups/attributes
- LDAP bind/search is an access pattern, not federation

Scenarios:

- `bind-authentication`
- `group-lookup`

Important nodes:

- App Client
- LDAP Protocol
- Directory Service
- User Record
- Group / Attribute result

### 2. AD + Kerberos Flow

Teaching focus:

- AD is the directory/service boundary
- Kerberos is the ticket-based authentication protocol
- separate TGT and service ticket steps

Scenarios:

- `domain-logon`
- `service-access`

Important nodes:

- User Workstation
- Active Directory
- Kerberos KDC
- TGT Cache
- Application Service
- Optional LDAP/Directory lookup note

### 3. SAML vs OIDC Side-by-Side

Teaching focus:

- compare browser/workforce federation vs mobile/web token flow
- SAML assertion vs OIDC JWT
- same identity-provider role, different federation artifact and client pattern

Modes:

- `compare`
- `saml-only`
- `oidc-only`

Important nodes:

- Browser lane
- Mobile/Web lane
- IdP
- SAML Assertion
- OIDC ID Token (JWT)
- AWS / Application target

### 4. Cognito Identity Pool Flow

Teaching focus:

- external identity token is input, not primary login
- identity pool maps trusted identity to IAM role
- STS issues temporary credentials
- app uses IAM-role session to access AWS resource

Scenarios:

- `oidc-provider`
- `saml-provider`

Important nodes:

- App
- External IdP token
- Cognito Identity Pool
- Role mapping
- AWS STS
- IAM Role
- S3 / API / DynamoDB target

## Manifest Changes

- Add four new entries in `data/simulations.ts`
- Remove the broad `aws-identity-federation` entry from the manifest
- Keep existing `aws-direct-connect` and `aws-mgn` intact

## Docs / Accuracy

Must preserve official source grounding for:

- LDAP protocol
- Kerberos protocol
- OIDC Core
- SAML overview
- Cognito Identity Pools
- STS `AssumeRoleWithWebIdentity`
- STS `AssumeRoleWithSAML`

## Verification

- syntax-check JS in all four HTML files
- confirm all four manifest entries resolve into `/s/[slug]` and `/s/[slug]/play`
- run `npm run validate`
- run `npm run build`
