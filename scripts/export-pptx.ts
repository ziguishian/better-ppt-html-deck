#!/usr/bin/env node
import { existsSync, readdirSync } from "node:fs";
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
  const imageDir = resolve(process.argv[2] || "exports/images");
  const output = resolve(process.argv[3] || "exports/deck.pptx");
  if (!existsSync(imageDir)) throw new Error(`Missing ${imageDir}. Run export:png first.`);
  const pptxModule = loadDependency("pptxgenjs");
  const pptxgen = pptxModule.default || pptxModule;
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  const images = readdirSync(imageDir).filter((file) => /\.(png|jpg|jpeg)$/i.test(file)).sort();
  for (const image of images) {
    const slide = pptx.addSlide();
    slide.addImage({ path: resolve(imageDir, image), x: 0, y: 0, w: 13.333, h: 7.5 });
  }
  await pptx.writeFile({ fileName: output });
  console.log(`Wrote ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
