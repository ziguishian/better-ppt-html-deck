import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import pptxgen from "pptxgenjs";

async function main() {
  const imageDir = resolve("exports/images");
  const output = resolve("exports/deck.pptx");
  if (!existsSync(imageDir)) throw new Error("Run npm run export:png first.");

  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  for (const file of readdirSync(imageDir).filter((name) => /\.png$/i.test(name)).sort()) {
    const slide = pptx.addSlide();
    slide.addImage({ path: resolve(imageDir, file), x: 0, y: 0, w: 13.333, h: 7.5 });
  }
  await pptx.writeFile({ fileName: output });
  console.log(`Wrote ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
