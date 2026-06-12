import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const deckPath = resolve("src/data/deck.json");
const issues: string[] = [];

if (!existsSync(deckPath)) {
  issues.push("Missing src/data/deck.json");
} else {
  const data = JSON.parse(readFileSync(deckPath, "utf8"));
  if (!data.deck?.title) issues.push("Missing deck title");
  if (data.deck?.aspectRatio !== "16:9") issues.push("Aspect ratio should be 16:9");
  if (!Array.isArray(data.slides) || data.slides.length !== 10) issues.push("Deck should contain exactly 10 slides");
  for (const slide of data.slides || []) {
    if (!slide.id || !slide.type || !slide.title) issues.push(`Slide ${slide.id || "unknown"} lacks id/type/title`);
    if (JSON.stringify(slide).length > 1800) issues.push(`${slide.id} may be too dense`);
    if (!slide.visual) issues.push(`${slide.id} is missing a replaceable visual asset`);
  }
}

const toolbar = existsSync("src/editor/Toolbar.tsx") ? readFileSync("src/editor/Toolbar.tsx", "utf8") : "";
const renderer = existsSync("src/slides/SlideRenderer.tsx") ? readFileSync("src/slides/SlideRenderer.tsx", "utf8") : "";
if (!toolbar.includes("exportDeckToPptx")) issues.push("Toolbar is missing browser-side one-click PPTX export");
if (!renderer.includes("EditableImage")) issues.push("Slides are missing editable image support");
if (!renderer.includes("notes-editor")) issues.push("Slides are missing editable notes support");

const report = `# QA Report

## Basic Validation

${issues.length ? "Needs fixes" : "Passed"}

## Issues

${issues.length ? issues.map((issue) => `- ${issue}`).join("\n") : "- None"}

## Manual Checks

- Preview mode should hide editor chrome.
- Present mode should support arrow keys, space, Esc, progress, and notes.
- Edit mode should allow click-to-edit all visible text, notes, and local autosave.
- Visual assets should be replaceable through EditableImage.
- Export mode should expose browser-side one-click PPTX plus PDF/PNG/PPTX/JSON options.
`;

writeFileSync("qa-report.md", report, "utf8");
console.log(report);
if (issues.length) process.exit(1);
