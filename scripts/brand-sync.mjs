#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const brandRoot = path.resolve(root, process.env.BRAND_DIR ?? "../brand");
const lockPath = path.join(root, "brand.lock.json");
const check = process.argv.includes("--check");
const files = [
  ...["light", "dark"].map((theme) => ({
    source: `assets/svg/logos/horizontal/technikteams-logo-horizontal-${theme}.svg`,
    target: `profile/assets/logo-horizontal-${theme}.svg`,
  })),
  {
    source: "sources/typography/OFL.txt",
    target: "profile/assets/OFL.txt",
  },
];
const sha256 = (content) => createHash("sha256").update(content).digest("hex");

async function main() {
  if (process.argv.slice(2).some((arg) => arg !== "--check")) {
    throw new Error("Aufruf: node scripts/brand-sync.mjs [--check]");
  }
  const hasSource = existsSync(path.join(brandRoot, "brand.json"));
  if (!check && !hasSource) throw new Error(`Brand-Repo fehlt: ${brandRoot}`);

  let expected;
  const contents = new Map();
  if (hasSource) {
    const brand = JSON.parse(await readFile(path.join(brandRoot, "brand.json"), "utf8"));
    const manifest = JSON.parse(
      await readFile(path.join(brandRoot, "assets/manifest.json"), "utf8"),
    );
    const entries = [];
    for (const file of files) {
      const content = await readFile(path.join(brandRoot, file.source));
      const hash = sha256(content);
      const manifestEntry = manifest.files.find((entry) => entry.path === file.source);
      // Die Schriftlizenz ist eine Quelle; das Exportmanifest führt nur die SVGs.
      if (file.source.endsWith(".svg") && manifestEntry?.sha256 !== hash) {
        throw new Error(`Brand-Manifest stimmt nicht mit Quelle überein: ${file.source}`);
      }
      entries.push({ ...file, sha256: hash });
      contents.set(file.target, content);
    }
    expected = { brand: { name: brand.name, version: brand.version }, files: entries };
  }

  if (check) {
    const lock = JSON.parse(await readFile(lockPath, "utf8"));
    if (expected && JSON.stringify(lock) !== JSON.stringify(expected)) {
      throw new Error("Brand-Lockfile ist veraltet. Bitte brand-sync.mjs ausführen.");
    }
    if (lock.files.length !== files.length) throw new Error("Unerwartete Asset-Anzahl.");
    for (const [index, file] of files.entries()) {
      const entry = lock.files[index];
      if (entry.source !== file.source || entry.target !== file.target) {
        throw new Error(`Unerwarteter Lockfile-Eintrag: ${file.target}`);
      }
      if (sha256(await readFile(path.join(root, file.target))) !== entry.sha256) {
        throw new Error(`Brand-Kopie stimmt nicht mit Lockfile überein: ${file.target}`);
      }
    }
    console.log(`✓ ${files.length} Brand-Dateien geprüft${hasSource ? " (inklusive Quellen)" : " (Lockfile)"}.`);
    return;
  }

  for (const [target, content] of contents) {
    await mkdir(path.dirname(path.join(root, target)), { recursive: true });
    await writeFile(path.join(root, target), content);
  }
  await writeFile(lockPath, `${JSON.stringify(expected, null, 2)}\n`);
  console.log(`✓ ${files.length} Brand-Dateien unverändert übernommen.`);
}

main().catch((error) => {
  console.error(`✖ brand-sync: ${error.message}`);
  process.exitCode = 1;
});
