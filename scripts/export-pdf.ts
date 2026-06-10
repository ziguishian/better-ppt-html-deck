#!/usr/bin/env node
import { mkdirSync } from "node:fs";
import Module, { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);
const bundledNodeModules = "C:\\Users\\baize\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules";
const bundledPnpmNodeModules = resolve(bundledNodeModules, ".pnpm", "node_modules");

function loadDependency(name: string): any {
  process.env.NODE_PATH = [bundledNodeModules, bundledPnpmNodeModules, process.env.NODE_PATH || ""].filter(Boolean).join(";");
  (Module as any)._initPaths?.();
  try {
    return require(name);
  } catch {
    return require(resolve(bundledNodeModules, name));
  }
}

async function main() {
  const url = process.env.DECK_URL || "http://localhost:5173";
  const output = resolve(process.argv[2] || "exports/deck.pdf");
  const { chromium } = loadDependency("playwright");
  mkdirSync(dirname(output), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto(`${url}?mode=preview&print=1`, { waitUntil: "networkidle" });
  await page.pdf({ path: output, printBackground: true, width: "16in", height: "9in" });
  await browser.close();
  console.log(`Wrote ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
