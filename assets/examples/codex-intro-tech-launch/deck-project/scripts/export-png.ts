import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import deck from "../src/data/deck.json";

async function main() {
  const url = process.env.DECK_URL || "http://127.0.0.1:5173";
  const outDir = resolve("exports/images");

  mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  for (let index = 1; index <= deck.slides.length; index += 1) {
    await page.goto(`${url}?mode=preview&slide=${index}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: resolve(outDir, `slide-${String(index).padStart(3, "0")}.png`) });
  }
  await browser.close();
  console.log(`Wrote ${deck.slides.length} PNG files`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
