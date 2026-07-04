import { existsSync } from "node:fs";
import path from "node:path";
import { simulations } from "../data/simulations";

const PUBLIC_DIR = path.join(process.cwd(), "public");

function fail(messages: string[]): never {
  console.error("\n❌ Invalid manifest:\n");
  for (const message of messages) {
    console.error(`  - ${message}`);
  }
  console.error("");
  process.exit(1);
}

function main() {
  const errors: string[] = [];
  const seenSlugs = new Set<string>();

  for (const sim of simulations) {
    if (seenSlugs.has(sim.slug)) {
      errors.push(`Duplicate slug: "${sim.slug}"`);
    }
    seenSlugs.add(sim.slug);

    const htmlFile = path.join(PUBLIC_DIR, sim.htmlPath.replace(/^\//, ""));
    if (!existsSync(htmlFile)) {
      errors.push(`[${sim.slug}] htmlPath not found: ${sim.htmlPath}`);
    }

    if (sim.thumbnail) {
      const thumbFile = path.join(PUBLIC_DIR, sim.thumbnail.replace(/^\//, ""));
      if (!existsSync(thumbFile)) {
        errors.push(`[${sim.slug}] thumbnail not found: ${sim.thumbnail}`);
      }
    }
  }

  if (errors.length > 0) {
    fail(errors);
  }

  console.log(`✅ Manifest valid: ${simulations.length} simulation(s).`);
}

main();
