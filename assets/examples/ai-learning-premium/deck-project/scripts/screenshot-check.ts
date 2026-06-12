import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";

async function main() {
  const url = process.env.DECK_URL || "http://127.0.0.1:5173";
  mkdirSync("exports", { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(`${url}?mode=preview`, { waitUntil: "networkidle" });
  await page.screenshot({ path: "exports/screenshot-check.png" });
  await browser.close();

  writeFileSync("qa-screenshot-report.md", `# Screenshot Check

- Screenshot: ${resolve("exports/screenshot-check.png")}
- Console errors: ${errors.length ? errors.join("; ") : "none"}
`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
