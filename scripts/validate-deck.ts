#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const deckPath = resolve(process.argv[2] || "src/data/deck.json");
const reportPath = resolve(process.argv[3] || "qa-report.md");
const issues: string[] = [];

if (!existsSync(deckPath)) {
  issues.push(`Missing ${deckPath}`);
} else {
  const deck = JSON.parse(readFileSync(deckPath, "utf8"));
  if (!deck.deck?.title) issues.push("Missing deck title.");
  if (!Array.isArray(deck.slides)) issues.push("slides must be an array.");
  for (const slide of deck.slides || []) {
    if (!slide.id) issues.push("A slide is missing id.");
    if (!slide.type) issues.push(`${slide.id || "unknown"} is missing type.`);
    if (!slide.title) issues.push(`${slide.id || "unknown"} is missing title.`);
    if (!slide.visual && !slide.image && !slide.diagram && slide.type !== "section") issues.push(`${slide.id} has no registered visual, image, or diagram asset.`);
    const text = JSON.stringify(slide);
    if (text.length > 1800) issues.push(`${slide.id} may be too dense.`);
  }
}

const requiredSourceFiles = [
  "src/editor/Toolbar.tsx",
  "src/editor/ExportPanel.tsx",
  "src/editor/EditableImage.tsx",
  "src/slides/SlideRenderer.tsx"
];

for (const file of requiredSourceFiles) {
  if (!existsSync(file)) issues.push(`Missing ${file}`);
}

if (existsSync("src/editor/Toolbar.tsx")) {
  const toolbar = readFileSync("src/editor/Toolbar.tsx", "utf8");
  if (!/PPTX|export.*Pptx|pptx/i.test(toolbar)) issues.push("Toolbar does not expose a visible one-click PPTX export path.");
}

if (existsSync("src/slides/SlideRenderer.tsx")) {
  const renderer = readFileSync("src/slides/SlideRenderer.tsx", "utf8");
  if (!renderer.includes("EditableText")) issues.push("Slide renderer does not use EditableText.");
  if (!renderer.includes("EditableImage")) issues.push("Slide renderer does not use EditableImage for replaceable visuals.");
}

const report = `# QA Report

## Result

${issues.length ? "Needs fixes" : "Passed basic validation"}

## Issues

${issues.length ? issues.map((issue) => `- ${issue}`).join("\n") : "- None found by basic validation."}
`;

writeFileSync(reportPath, report, "utf8");
console.log(report);
if (issues.length) process.exit(1);
