#!/usr/bin/env node
/**
 * Copies the profile logos from the installed package @technikteams/brand (handbook CODE-8).
 * GitHub shows only files from this repository in the organisation profile, so the copies are
 * committed; they are generated files (CODE-6) and never edited by hand.
 *
 *   pnpm brand:sync    copy from node_modules/@technikteams/brand and write brand.lock.json
 *   pnpm check         verify copies against the lockfile and the installed package
 *
 * Update the brand: `pnpm add -D -E @technikteams/brand@<version>`, then `pnpm brand:sync`.
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const packageRoot = path.join(root, "node_modules", "@technikteams", "brand");
const lockPath = path.join(root, "brand.lock.json");
const files = [
  ...["light", "dark"].map((theme) => ({
    source: `assets/svg/logos/horizontal/technikteams-logo-horizontal-${theme}.svg`,
    target: `profile/assets/logo-horizontal-${theme}.svg`,
  })),
  // The wordmark is drawn from Montserrat; its licence travels with the logos.
  { source: "assets/fonts/OFL-montserrat.txt", target: "profile/assets/OFL.txt" },
];
const sha256 = (content) => createHash("sha256").update(content).digest("hex");

/** What the lockfile must contain for the installed package, plus the file contents. */
async function fromPackage() {
  if (!existsSync(path.join(packageRoot, "package.json"))) {
    throw new Error("@technikteams/brand ist nicht installiert: pnpm install (Token: README).");
  }
  const pkg = JSON.parse(await readFile(path.join(packageRoot, "package.json"), "utf8"));
  const manifest = JSON.parse(await readFile(path.join(packageRoot, "assets/manifest.json"), "utf8"));
  const hashes = new Map(manifest.files.map((entry) => [entry.path, entry.sha256]));
  const contents = new Map();
  const entries = [];
  for (const file of files) {
    const content = await readFile(path.join(packageRoot, file.source));
    const hash = sha256(content);
    if (hashes.get(file.source) !== hash) {
      throw new Error(`Datei passt nicht zum Manifest des Pakets: ${file.source}`);
    }
    entries.push({ ...file, sha256: hash });
    contents.set(file.target, content);
  }
  return { lock: { brand: { package: pkg.name, version: pkg.version }, files: entries }, contents };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== "--check")) throw new Error("Aufruf: node scripts/brand-sync.mjs [--check]");
  const { lock: expected, contents } = await fromPackage();

  if (args.includes("--check")) {
    const lock = JSON.parse(await readFile(lockPath, "utf8"));
    if (JSON.stringify(lock) !== JSON.stringify(expected)) {
      throw new Error("brand.lock.json passt nicht zum installierten Paket: pnpm brand:sync ausführen.");
    }
    for (const entry of lock.files) {
      if (sha256(await readFile(path.join(root, entry.target))) !== entry.sha256) {
        throw new Error(`Kopie verändert: ${entry.target}. Nie von Hand ändern, pnpm brand:sync ausführen.`);
      }
    }
    console.log(`✓ ${lock.files.length} Brand-Dateien passen zu ${lock.brand.package}@${lock.brand.version}.`);
    return;
  }

  for (const [target, content] of contents) {
    await mkdir(path.dirname(path.join(root, target)), { recursive: true });
    await writeFile(path.join(root, target), content);
  }
  await writeFile(lockPath, `${JSON.stringify(expected, null, 2)}\n`);
  console.log(`✓ ${contents.size} Dateien aus ${expected.brand.package}@${expected.brand.version} übernommen.`);
}

main().catch((error) => {
  console.error(`✖ brand-sync: ${error.message}`);
  process.exitCode = 1;
});
