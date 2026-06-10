#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] || "deck-project");

const dirs = [
  "src/data",
  "src/editor",
  "src/slides",
  "src/components/visuals",
  "src/components/diagrams",
  "src/components/frames",
  "src/components/icons",
  "src/theme",
  "src/utils",
  "src/styles",
  "public/assets/images",
  "public/assets/icons",
  "public/assets/logos",
  "scripts",
  "exports/images"
];

for (const dir of dirs) mkdirSync(resolve(root, dir), { recursive: true });

writeFileSync(resolve(root, "package.json"), JSON.stringify({
  scripts: {
    dev: "vite",
    build: "vite build",
    preview: "vite preview",
    "export:pdf": "tsx scripts/export-pdf.ts",
    "export:png": "tsx scripts/export-png.ts",
    "export:pptx": "tsx scripts/export-pptx.ts",
    validate: "tsx scripts/validate-deck.ts",
    screenshot: "tsx scripts/screenshot-check.ts"
  },
  dependencies: {
    "@vitejs/plugin-react": "latest",
    vite: "latest",
    react: "latest",
    "react-dom": "latest",
    playwright: "latest",
    pptxgenjs: "latest",
    lucide-react: "latest"
  },
  devDependencies: {
    tsx: "latest",
    typescript: "latest"
  }
}, null, 2), "utf8");

writeFileSync(resolve(root, "src/data/deck.json"), JSON.stringify({
  deck: { title: "Untitled Deck", subtitle: "", aspectRatio: "16:9", theme: "custom", language: "zh-CN" },
  slides: []
}, null, 2), "utf8");

writeFileSync(resolve(root, "README.md"), `# HTML PPT Deck

Use this project as the editable source for the deck.

- Start: \`npm run dev\`
- Build: \`npm run build\`
- Preview: \`npm run preview\`
- Export PDF: \`npm run export:pdf\`
- Export PNG: \`npm run export:png\`
- Export PPTX: \`npm run export:pptx\`
- Validate: \`npm run validate\`

Edit text and replace images in browser edit mode. Export and import \`deck.json\` from the export panel.
`, "utf8");

console.log(`Created ${root}`);
