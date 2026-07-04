# CloudViz SA

A static web library of interactive cloud architecture simulations (AWS / Azure / GCP) for
Solution Architects — browse, open, and learn each component inside a design.

Each simulation is a self-contained HTML file (kept as authored); the platform is only a
gallery + viewer (search/filter + embedded `<iframe>` player).

Full design docs live in [`docs/`](./docs/README.md).

## Run locally

```bash
npm install
npm run dev       # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

## Layout

```
app/                   # Pages: gallery (/) and player (/s/[slug], /s/[slug]/play)
components/            # UI components (cards, filters, player, hero)
lib/                   # types, catalog, badges, site config
data/simulations.ts    # MANIFEST — single source of truth for the catalog
public/simulations/    # Simulation HTML files
public/thumbs/         # Optional thumbnails
docs/                  # Design documentation
scripts/               # Build-time manifest validation
```

## Add a simulation

1. Copy the HTML file into `public/simulations/`.
2. (Optional) add a thumbnail under `public/thumbs/`.
3. Register an entry in `data/simulations.ts`.
4. Run `npm run validate` (also runs automatically before `npm run build`).

See [`docs/06-quy-trinh-them-mo-phong.md`](./docs/06-quy-trinh-them-mo-phong.md) for the full checklist.
