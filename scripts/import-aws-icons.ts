/**
 * Import AWS Architecture Icons from the official asset package.
 *
 * Policy:
 * - Keep every unique service/resource/category/group icon
 * - Keep SVG only
 * - Keep one canonical size per icon (prefer 32px, then 48, 64, 16)
 * - Skip PNG, __MACOSX, .DS_Store
 *
 * Usage:
 *   npx tsx scripts/import-aws-icons.ts /path/to/Icon-package_04302026...
 */

import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const SOURCE_DEFAULT =
  "/home/dathv2/Downloads/Icon-package_04302026.4705b90f5aa45b019271a2699e9ce9b97b941ee1";
const OUT_ROOT = join(process.cwd(), "public/icons/aws");
const MANIFEST_PATH = join(process.cwd(), "data/awsIconManifest.ts");

const SIZE_PRIORITY = [32, 48, 64, 16] as const;

type AwsIconKind = "service" | "resource" | "category" | "group";

interface AwsIconEntry {
  key: string;
  kind: AwsIconKind;
  category: string;
  label: string;
  path: string;
  sourceFile: string;
  size: number;
}

function slugify(value: string): string {
  return value
    .replace(/^(Arch|Res|Arch-Category)[-_]?/i, "")
    .replace(/[_\s]+/g, "-")
    .replace(/[^A-Za-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function categorySlug(folderName: string): string {
  return folderName
    .replace(/^(Arch|Res)[-_]/, "")
    .replace(/^(Arch-Category)[-_]/, "")
    .replace(/_/g, "-")
    .toLowerCase();
}

function humanLabel(stem: string): string {
  return stem
    .replace(/^(Arch|Res|Arch-Category)[-_]?/i, "")
    .replace(/_\d+$/, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSizeFromName(name: string): number | null {
  const match = name.match(/_(\d+)(?:_Dark)?\.svg$/i);
  return match ? Number(match[1]) : null;
}

function pickCanonicalSvg(files: string[]): { file: string; size: number } | null {
  const svgFiles = files.filter((f) => f.toLowerCase().endsWith(".svg"));
  if (!svgFiles.length) return null;

  const bySize = new Map<number, string[]>();
  for (const file of svgFiles) {
    const size = parseSizeFromName(file);
    if (!size) continue;
    const list = bySize.get(size) ?? [];
    list.push(file);
    bySize.set(size, list);
  }

  for (const size of SIZE_PRIORITY) {
    const candidates = bySize.get(size);
    if (!candidates?.length) continue;
    const preferred = candidates.find((f) => !/_Dark\.svg$/i.test(f)) ?? candidates[0];
    return { file: preferred, size };
  }

  const fallback = svgFiles.find((f) => !/_Dark\.svg$/i.test(f)) ?? svgFiles[0];
  const size = parseSizeFromName(fallback) ?? 32;
  return { file: fallback, size };
}

function iconStem(name: string): string {
  return name.replace(/\.svg$/i, "").replace(/_\d+(?:_Dark)?$/i, "");
}

function collectServiceIcons(sourceRoot: string, entries: AwsIconEntry[]) {
  const base = join(sourceRoot, "Architecture-Service-Icons_04302026");
  if (!statSync(base, { throwIfNoEntry: false })?.isDirectory()) return;

  for (const categoryDir of readdirSync(base)) {
    if (!categoryDir.startsWith("Arch_") || categoryDir.startsWith("__")) continue;
    const categoryPath = join(base, categoryDir);
    if (!statSync(categoryPath).isDirectory()) continue;

    const stems = new Map<string, { names: string[]; paths: string[] }>();

    for (const child of readdirSync(categoryPath)) {
      const childPath = join(categoryPath, child);
      if (statSync(childPath).isDirectory() && /^\d+$/.test(child)) {
        for (const file of readdirSync(childPath)) {
          if (!file.toLowerCase().endsWith(".svg")) continue;
          const stem = iconStem(file);
          const bucket = stems.get(stem) ?? { names: [], paths: [] };
          bucket.names.push(file);
          bucket.paths.push(join(childPath, file));
          stems.set(stem, bucket);
        }
      } else if (child.toLowerCase().endsWith(".svg")) {
        const stem = iconStem(child);
        const bucket = stems.get(stem) ?? { names: [], paths: [] };
        bucket.names.push(child);
        bucket.paths.push(childPath);
        stems.set(stem, bucket);
      }
    }

    for (const [stem, bucket] of stems) {
      const picked = pickCanonicalSvg(bucket.names);
      if (!picked) continue;
      const index = bucket.names.indexOf(picked.file);
      const sourceFile = index >= 0 ? bucket.paths[index] : undefined;
      if (!sourceFile) continue;

      const cat = categorySlug(categoryDir);
      const iconSlug = slugify(stem);
      const relPath = join("services", cat, `${iconSlug}.svg`);
      const outPath = join(OUT_ROOT, relPath);
      mkdirSync(dirname(outPath), { recursive: true });
      cpSync(sourceFile, outPath);

      entries.push({
        key: `aws-service-${cat}-${iconSlug}`,
        kind: "service",
        category: cat,
        label: humanLabel(stem),
        path: `/icons/aws/${relPath.replace(/\\/g, "/")}`,
        sourceFile: relative(sourceRoot, sourceFile),
        size: picked.size,
      });
    }
  }
}

function collectFlatCategoryIcons(
  sourceRoot: string,
  folderName: string,
  kind: AwsIconKind,
  outSubdir: string,
  entries: AwsIconEntry[],
) {
  const base = join(sourceRoot, folderName);
  if (!statSync(base, { throwIfNoEntry: false })?.isDirectory()) return;

  const stems = new Map<string, { names: string[]; paths: string[] }>();
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      if (entry.startsWith("__") || entry === ".DS_Store") continue;
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.toLowerCase().endsWith(".svg")) continue;
      const stem = iconStem(entry);
      const bucket = stems.get(stem) ?? { names: [], paths: [] };
      bucket.names.push(entry);
      bucket.paths.push(full);
      stems.set(stem, bucket);
    }
  };
  walk(base);

  for (const [stem, bucket] of stems) {
    const picked = pickCanonicalSvg(bucket.names);
    if (!picked) continue;
    const index = bucket.names.indexOf(picked.file);
    const sourceFile = index >= 0 ? bucket.paths[index] : undefined;
    if (!sourceFile) continue;

    const iconSlug = slugify(stem);
    const relPath = join(outSubdir, `${iconSlug}.svg`);
    const outPath = join(OUT_ROOT, relPath);
    mkdirSync(dirname(outPath), { recursive: true });
    cpSync(sourceFile, outPath);

    entries.push({
      key: `aws-${kind}-${iconSlug}`,
      kind,
      category: outSubdir,
      label: humanLabel(stem),
      path: `/icons/aws/${relPath.replace(/\\/g, "/")}`,
      sourceFile: relative(sourceRoot, sourceFile),
      size: picked.size,
    });
  }
}

function collectResourceIcons(sourceRoot: string, entries: AwsIconEntry[]) {
  const base = join(sourceRoot, "Resource-Icons_04302026");
  if (!statSync(base, { throwIfNoEntry: false })?.isDirectory()) return;

  for (const categoryDir of readdirSync(base)) {
    if (!categoryDir.startsWith("Res_") || categoryDir.startsWith("__")) continue;
    const categoryPath = join(base, categoryDir);
    if (!statSync(categoryPath).isDirectory()) continue;

    const stems = new Map<string, { names: string[]; paths: string[] }>();
    for (const file of readdirSync(categoryPath)) {
      if (!file.toLowerCase().endsWith(".svg")) continue;
      const stem = iconStem(file);
      const bucket = stems.get(stem) ?? { names: [], paths: [] };
      bucket.names.push(file);
      bucket.paths.push(join(categoryPath, file));
      stems.set(stem, bucket);
    }

    for (const [stem, bucket] of stems) {
      const picked = pickCanonicalSvg(bucket.names);
      if (!picked) continue;
      const index = bucket.names.indexOf(picked.file);
      const sourceFile = index >= 0 ? bucket.paths[index] : undefined;
      if (!sourceFile) continue;

      const cat = categorySlug(categoryDir);
      const iconSlug = slugify(stem);
      const relPath = join("resources", cat, `${iconSlug}.svg`);
      const outPath = join(OUT_ROOT, relPath);
      mkdirSync(dirname(outPath), { recursive: true });
      cpSync(sourceFile, outPath);

      entries.push({
        key: `aws-resource-${cat}-${iconSlug}`,
        kind: "resource",
        category: cat,
        label: humanLabel(stem),
        path: `/icons/aws/${relPath.replace(/\\/g, "/")}`,
        sourceFile: relative(sourceRoot, sourceFile),
        size: picked.size,
      });
    }
  }
}

function writeManifest(entries: AwsIconEntry[]) {
  const sorted = [...entries].sort((a, b) => a.key.localeCompare(b.key));
  const body = `// AUTO-GENERATED by scripts/import-aws-icons.ts — do not edit by hand.
export type AwsIconKind = "service" | "resource" | "category" | "group";

export interface AwsIconEntry {
  key: string;
  kind: AwsIconKind;
  category: string;
  label: string;
  path: string;
  sourceFile: string;
  size: number;
}

export const AWS_ICON_SOURCE = "https://aws.amazon.com/architecture/icons/";
export const AWS_ICON_PACKAGE = "Architecture Icons 04/30/2026";
export const AWS_ICON_CANONICAL_FORMAT = "svg";
export const AWS_ICON_CANONICAL_SIZE = 32;

export const awsIconManifest: AwsIconEntry[] = ${JSON.stringify(sorted, null, 2)} as AwsIconEntry[];

export function getAwsIcon(key: string): AwsIconEntry | undefined {
  return awsIconManifest.find((icon) => icon.key === key);
}

export function searchAwsIcons(query: string, kind?: AwsIconKind): AwsIconEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return awsIconManifest.filter((icon) => {
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

function main() {
  const sourceRoot = process.argv[2] ?? SOURCE_DEFAULT;
  if (!statSync(sourceRoot, { throwIfNoEntry: false })?.isDirectory()) {
    console.error(`Source package not found: ${sourceRoot}`);
    process.exit(1);
  }

  rmSync(OUT_ROOT, { recursive: true, force: true });
  mkdirSync(OUT_ROOT, { recursive: true });

  const entries: AwsIconEntry[] = [];
  collectServiceIcons(sourceRoot, entries);
  collectResourceIcons(sourceRoot, entries);
  collectFlatCategoryIcons(sourceRoot, "Category-Icons_04302026", "category", "categories", entries);
  collectFlatCategoryIcons(sourceRoot, "Architecture-Group-Icons_04302026", "group", "groups", entries);

  writeManifest(entries);

  const counts = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.kind] = (acc[e.kind] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`Imported ${entries.length} AWS icons from ${sourceRoot}`);
  console.log("By kind:", counts);
  console.log(`Output: ${OUT_ROOT}`);
  console.log(`Manifest: ${MANIFEST_PATH}`);
}

main();
