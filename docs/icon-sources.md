# Cloud Icon Sources

Access date: 2026-07-06

This repository stores provider icons for architecture diagrams and interactive learning simulators. Icons are visual aids only: every simulator must keep text labels near icons and must not use icons as the only source of meaning.

## Usage Rules

- Use official or clearly licensed icon sources.
- Prefer SVG.
- Do not crop, flip, rotate, distort, recolor, or remove notices from provider icons.
- Do not use provider icons to represent another vendor or this project's own product.
- Keep product/service names close to icons in diagrams.

## Sources

| Provider | Source | Ingestion Status | Notes |
|---|---|---|---|
| AWS | `https://aws.amazon.com/architecture/icons/` | Ingested | Package: **Architecture Icons 04/30/2026** (local import). **766** unique icons: 305 services, 422 resources, 26 categories, 13 groups. Canonical format: **SVG only**, prefer **32px**; resource icons fall back to 48px when 32px is unavailable. PNG, EPS, Visio, PPTX, and duplicate size folders are excluded. |
| Azure | `https://learn.microsoft.com/en-us/azure/architecture/icons/` | Ingested | Direct package: `https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V23.zip`. Microsoft permits use in architecture diagrams, training materials, and documentation. |
| Google Cloud | `https://cloud.google.com/icons` | Ingested | Direct packages: `https://services.google.com/fh/files/misc/core-products-icons.zip` and `https://services.google.com/fh/files/misc/category-icons.zip`. Prefer the 2025+ product icon system. |
| Kubernetes | `https://github.com/kubernetes/community/tree/master/icons` | Ingested | Kubernetes icons are licensed under Apache-2.0 or CC-BY-4.0. Kubernetes logo trademark rules still apply. |
| Cisco | `https://www.cisco.com/c/en/us/about/brand-center/network-topology-icons.html` + [SAFE Icon Library](https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/safe-icon-library.html) | Ingested | **645** icons: **349** SAFE (native SVG) + **296** classic topology (EPS PMS 3015 converted to SVG via LibreOffice). SVG only in repo; PNG and duplicate SAFE size set (Capability .16) excluded. Cisco permits free use in diagrams if icons are not altered. |
| Software brands | [Simple Icons](https://github.com/simple-icons/simple-icons) | Ingested | **~3400** brand SVGs (Go, Nginx, Docker, PostgreSQL, …). Package license: **CC0-1.0**. Individual trademarks still apply — use each icon only for its corresponding product. Do not crop, recolor, or distort logos. |
| Palo Alto Networks | Press kit and stencil pages | Deferred / restricted | Terms appear more restrictive. Do not include assets until usage terms are explicitly acceptable for this repo. |

## Current Asset Layout

```text
public/icons/
  aws/
    services/{category}/          # Architecture service icons (SVG, canonical size)
    resources/{category}/         # Resource-level icons (SVG, canonical size)
    categories/                   # Category icons
    groups/                       # Architecture group icons (VPC, subnet, region, ...)
  azure/icons/                    # Azure SVG services
  gcp/core/svg/                   # Google Cloud core product SVGs
  gcp/category/svg/               # Google Cloud category SVGs
  third-party/kubernetes/         # Kubernetes SVG icon set
  third-party/cisco/
    safe/{category}/               # SAFE methodology icons (native SVG)
    topology/                      # Classic network topology icons (EPS→SVG)
  third-party/brands/              # Software/language/product brand SVGs (Simple Icons)
```

## Lookup

- Curated simulator keys: `data/iconCatalog.ts`
- Full AWS catalog (auto-generated): `data/awsIconManifest.ts`
- Full Cisco catalog (auto-generated): `data/ciscoIconManifest.ts`
- Full brand catalog (auto-generated): `data/brandIconManifest.ts`
- Re-import AWS icons: `npx tsx scripts/import-aws-icons.ts /path/to/Icon-package_04302026...`
- Re-import Cisco icons: `npm run import-cisco-icons` (requires `soffice` / LibreOffice for topology EPS conversion)
- Re-import brand icons: `npm run import-brand-icons` (reads from `simple-icons` devDependency)

## Maintenance

When refreshing icons:

1. Download from the official source page.
2. Extract SVG only.
3. Exclude archives, PNG, EPS, Visio, PPTX, `__MACOSX`, and generated thumbnails.
4. For AWS: keep every unique icon, but only one canonical variant per icon (SVG, prefer 32px).
5. Update this file with source version/date.
6. Update `data/iconCatalog.ts` only for icons the app or simulators reference directly.
7. Re-run `scripts/import-aws-icons.ts` to regenerate `data/awsIconManifest.ts`.
8. Re-run `scripts/import-cisco-icons.ts` to regenerate `data/ciscoIconManifest.ts` (LibreOffice required).
9. Re-run `scripts/import-brand-icons.ts` to regenerate `data/brandIconManifest.ts` after updating `simple-icons`.
