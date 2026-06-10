import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { chromium } from "playwright";
import deck from "../src/data/deck.json";

async function main() {
  const url = process.env.DECK_URL || "http://127.0.0.1:5173";
  const output = resolve("exports/deck.pdf");

  mkdirSync(dirname(output), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const images: string[] = [];
  for (let index = 1; index <= deck.slides.length; index += 1) {
    await page.goto(`${url}?mode=preview&slide=${index}`, { waitUntil: "networkidle" });
    const image = await page.screenshot({ type: "png" });
    images.push(`data:image/png;base64,${image.toString("base64")}`);
  }
  await page.setContent(`<!doctype html>
    <html>
      <head>
        <style>
          @page { size: 16in 9in; margin: 0; }
          body { margin: 0; }
          .page { width: 16in; height: 9in; page-break-after: always; }
          img { width: 100%; height: 100%; display: block; }
        </style>
      </head>
      <body>${images.map((src) => `<section class="page"><img src="${src}" /></section>`).join("")}</body>
    </html>`);
  await page.pdf({ path: output, width: "16in", height: "9in", printBackground: true });
  await browser.close();
  console.log(`Wrote ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
