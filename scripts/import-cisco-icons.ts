/**
 * Import Cisco icons from official Cisco sources.
 *
 * Sources:
 * - SAFE Icon Library (native SVG): security/architecture topology icons
 * - Network Topology Icons (EPS, PMS 3015 color) converted to SVG via LibreOffice
 *
 * Policy:
 * - Keep every unique icon
 * - SVG only in the repo (PNG excluded; EPS converted once for topology set)
 * - Skip duplicate size sets (Capability .16 when .43 exists)
 * - Skip _BLANK label-placeholder variants
 *
 * Requirements:
 * - curl
 * - unzip
 * - soffice (LibreOffice) for topology EPS conversion
 *
 * Usage:
 *   npx tsx scripts/import-cisco-icons.ts
 *   npx tsx scripts/import-cisco-icons.ts --skip-topology   # SAFE only
 */

import {
  cpSync,
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, relative } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const OUT_ROOT = join(process.cwd(), "public/icons/third-party/cisco");
const MANIFEST_PATH = join(process.cwd(), "data/ciscoIconManifest.ts");

const SAFE_ZIP_URL =
  "https://www.cisco.com/c/dam/en/us/solutions/collateral/enterprise/design-zone-security/safe-icon-library.zip";
const TOPOLOGY_EPS_URL = "https://www.cisco.com/c/dam/en_us/about/ac50/ac47/3015_eps.zip";

const CISCO_TOPOLOGY_SOURCE =
  "https://www.cisco.com/c/en/us/about/brand-center/network-topology-icons.html";
const CISCO_SAFE_SOURCE =
  "https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/safe-icon-library.html";

type CiscoIconKind = "safe" | "topology";
type CiscoIconSource = "safe-native-svg" | "topology-eps-converted";

interface CiscoIconEntry {
  key: string;
  kind: CiscoIconKind;
  category: string;
  label: string;
  path: string;
  sourceFile: string;
  sourceUrl: string;
  format: "svg";
  origin: CiscoIconSource;
}

const SAFE_SET_SLUGS: Record<string, string> = {
  "Architecture Icons (green) .63": "architecture",
  "Attack Surface Icons (gray) .43": "attack-surface",
  "Capability Icons (blue) .43": "capability",
  "Design Icons (purple) .33x.38": "design",
  "Design Outline Icons (purple) .33x.38": "design-outline",
  "Threat Icons (orange)": "threat",
};

const SKIP_SAFE_SETS = new Set(["Capability Icons (blue) .16"]);

function slugify(value: string): string {
  return value
    .replace(/\.(eps|svg)$/i, "")
    .replace(/^(Arch|Gray|Capability|Design(?: OL)?|Threat)_\d+_/i, "")
    .replace(/_/g, " ")
    .replace(/[^A-Za-z0-9.+-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function humanLabel(stem: string): string {
  return stem
    .replace(/\.(eps|svg)$/i, "")
    .replace(/^(Arch|Gray|Capability|Design(?: OL)?|Threat)_\d+_/i, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function download(url: string, dest: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Download failed (${response.status}): ${url}`);
  }
  mkdirSync(dirname(dest), { recursive: true });
  await pipeline(Readable.fromWeb(response.body as never), createWriteStream(dest));
}

function unzip(zipPath: string, dest: string): void {
  const result = spawnSync("unzip", ["-qo", zipPath, "-d", dest], { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`unzip failed for ${zipPath}`);
  }
}

function requireLibreOffice(): void {
  const result = spawnSync("which", ["soffice"], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(
      "LibreOffice (soffice) is required to convert Cisco topology EPS icons to SVG.",
    );
  }
}

function convertEpsToSvg(epsPath: string, outDir: string): string | null {
  mkdirSync(outDir, { recursive: true });
  const result = spawnSync("soffice", ["--headless", "--convert-to", "svg", epsPath, "--outdir", outDir], {
    stdio: "pipe",
    encoding: "utf8",
  });
  if (result.status !== 0) return null;

  const base = slugify(basenameNoExt(epsPath));
  const candidates = [
    join(outDir, `${basenameNoExt(epsPath)}.svg`),
    join(outDir, `${basenameNoExt(epsPath).replace(/ /g, "_")}.svg`),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  const created = readdirSync(outDir)
    .filter((f) => f.toLowerCase().endsWith(".svg"))
    .map((f) => join(outDir, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return created[0] ?? null;
}

function basenameNoExt(filePath: string): string {
  const name = filePath.split(/[\\/]/).pop() ?? filePath;
  return name.replace(/\.[^.]+$/, "");
}

function ingestSafeIcons(extractedRoot: string, entries: CiscoIconEntry[]): void {
  const safeRoot = join(extractedRoot, "SAFE Icons Library");
  if (!existsSync(safeRoot)) {
    throw new Error("SAFE Icons Library folder not found in extracted archive.");
  }

  for (const setName of readdirSync(safeRoot)) {
    if (SKIP_SAFE_SETS.has(setName)) continue;
    const category = SAFE_SET_SLUGS[setName];
    if (!category) continue;

    const svgDir = join(safeRoot, setName, "SVG");
    if (!existsSync(svgDir)) continue;

    for (const file of readdirSync(svgDir)) {
      if (!file.toLowerCase().endsWith(".svg")) continue;
      if (/_BLANK\.svg$/i.test(file)) continue;

      const sourceFile = join(svgDir, file);
      const iconSlug = slugify(file);
      const relPath = join("safe", category, `${iconSlug}.svg`);
      const outPath = join(OUT_ROOT, relPath);
      mkdirSync(dirname(outPath), { recursive: true });
      cpSync(sourceFile, outPath);

      entries.push({
        key: `cisco-safe-${category}-${iconSlug}`,
        kind: "safe",
        category,
        label: humanLabel(file),
        path: `/icons/third-party/cisco/${relPath.replace(/\\/g, "/")}`,
        sourceFile: relative(extractedRoot, sourceFile),
        sourceUrl: CISCO_SAFE_SOURCE,
        format: "svg",
        origin: "safe-native-svg",
      });
    }
  }
}

function ingestTopologyIcons(extractedRoot: string, entries: CiscoIconEntry[]): void {
  const epsFiles = readdirSync(extractedRoot).filter((f) => f.toLowerCase().endsWith(".eps"));
  const convertDir = join(extractedRoot, "_converted");
  mkdirSync(convertDir, { recursive: true });

  for (const file of epsFiles) {
    const epsPath = join(extractedRoot, file);
    const iconSlug = slugify(file);
    const relPath = join("topology", `${iconSlug}.svg`);
    const outPath = join(OUT_ROOT, relPath);

    const converted = convertEpsToSvg(epsPath, convertDir);
    if (!converted) {
      console.warn(`Skipped topology icon (conversion failed): ${file}`);
      continue;
    }

    mkdirSync(dirname(outPath), { recursive: true });
    cpSync(converted, outPath);

    entries.push({
      key: `cisco-topology-${iconSlug}`,
      kind: "topology",
      category: "topology",
      label: humanLabel(file),
      path: `/icons/third-party/cisco/${relPath.replace(/\\/g, "/")}`,
      sourceFile: file,
      sourceUrl: CISCO_TOPOLOGY_SOURCE,
      format: "svg",
      origin: "topology-eps-converted",
    });
  }
}

function writeManifest(entries: CiscoIconEntry[]) {
  const sorted = [...entries].sort((a, b) => a.key.localeCompare(b.key));
  const body = `// AUTO-GENERATED by scripts/import-cisco-icons.ts — do not edit by hand.
export type CiscoIconKind = "safe" | "topology";
export type CiscoIconSource = "safe-native-svg" | "topology-eps-converted";

export interface CiscoIconEntry {
  key: string;
  kind: CiscoIconKind;
  category: string;
  label: string;
  path: string;
  sourceFile: string;
  sourceUrl: string;
  format: "svg";
  origin: CiscoIconSource;
}

export const CISCO_TOPOLOGY_SOURCE_URL = ${JSON.stringify(CISCO_TOPOLOGY_SOURCE)};
export const CISCO_SAFE_SOURCE_URL = ${JSON.stringify(CISCO_SAFE_SOURCE)};
export const CISCO_ICON_CANONICAL_FORMAT = "svg";

export const ciscoIconManifest: CiscoIconEntry[] = ${JSON.stringify(sorted, null, 2)} as CiscoIconEntry[];

export function getCiscoIcon(key: string): CiscoIconEntry | undefined {
  return ciscoIconManifest.find((icon) => icon.key === key);
}

export function searchCiscoIcons(query: string, kind?: CiscoIconKind): CiscoIconEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ciscoIconManifest.filter((icon) => {
    if (kind && icon.kind !== kind) return false;
    return (
      icon.key.includes(q) ||
      icon.label.toLowerCase().includes(q) ||
      icon.category.includes(q)
    );
  });
}
`;
  writeFileSync(MANIFEST_PATH, body, "utf8");
}

async function main() {
  const skipTopology = process.argv.includes("--skip-topology");
  const workDir = join(process.cwd(), ".cache/cisco-icon-import");
  rmSync(OUT_ROOT, { recursive: true, force: true });
  mkdirSync(OUT_ROOT, { recursive: true });
  mkdirSync(workDir, { recursive: true });

  const entries: CiscoIconEntry[] = [];

  const safeZip = join(workDir, "safe-icon-library.zip");
  console.log("Downloading SAFE icon library...");
  await download(SAFE_ZIP_URL, safeZip);
  const safeExtract = join(workDir, "safe");
  rmSync(safeExtract, { recursive: true, force: true });
  mkdirSync(safeExtract, { recursive: true });
  unzip(safeZip, safeExtract);
  ingestSafeIcons(safeExtract, entries);
  console.log(`SAFE icons ingested: ${entries.length}`);

  if (!skipTopology) {
    requireLibreOffice();
    const topoZip = join(workDir, "topology-eps.zip");
    console.log("Downloading classic network topology EPS package...");
    await download(TOPOLOGY_EPS_URL, topoZip);
    const topoExtract = join(workDir, "topology");
    rmSync(topoExtract, { recursive: true, force: true });
    mkdirSync(topoExtract, { recursive: true });
    unzip(topoZip, topoExtract);

    const before = entries.length;
    ingestTopologyIcons(topoExtract, entries);
    console.log(`Topology icons ingested: ${entries.length - before}`);
  }

  writeManifest(entries);

  const counts = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.kind] = (acc[e.kind] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`Imported ${entries.length} Cisco icons`);
  console.log("By kind:", counts);
  console.log(`Output: ${OUT_ROOT}`);
  console.log(`Manifest: ${MANIFEST_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
