#!/usr/bin/env node
import { mkdirSync } from "node:fs";
import Module, { createRequire } from "node:module";
import { resolve } from "node:path";

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
  const count = Number(process.env.SLIDE_COUNT || process.argv[2] || 1);
  const outDir = resolve(process.argv[3] || "exports/images");
  const { chromium } = loadDependency("playwright");
  mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  for (let index = 1; index <= count; index += 1) {
    await page.goto(`${url}?mode=preview&slide=${index}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: resolve(outDir, `slide-${String(index).padStart(3, "0")}.png`) });
  }
  await browser.close();
  console.log(`Wrote ${count} PNG files to ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
