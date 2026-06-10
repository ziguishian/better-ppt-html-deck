#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
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
  const output = resolve(process.argv[2] || "qa-screenshot.png");
  const { chromium } = loadDependency("playwright");
  mkdirSync(dirname(output), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(`${url}?mode=preview`, { waitUntil: "networkidle" });
  await page.screenshot({ path: output });
  await browser.close();
  writeFileSync("qa-screenshot-report.md", `# Screenshot QA\n\n- Screenshot: ${output}\n- Console errors: ${errors.length ? errors.join("; ") : "none"}\n`, "utf8");
  console.log(`Wrote ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
