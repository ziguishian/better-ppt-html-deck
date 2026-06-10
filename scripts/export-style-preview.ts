#!/usr/bin/env node
import { existsSync, mkdirSync } from "node:fs";
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
  const htmlPath = resolve(process.argv[2] || "styleframe.html");
  const outputPath = resolve(process.argv[3] || "style-preview.png");
  if (!existsSync(htmlPath)) throw new Error(`Missing ${htmlPath}`);

  const { chromium } = loadDependency("playwright");
  mkdirSync(dirname(outputPath), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(`file://${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: outputPath, fullPage: false });
  await browser.close();
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
