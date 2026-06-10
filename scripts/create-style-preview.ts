#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

type VisualDirection = {
  title?: string;
  styleName?: string;
  keywords?: string[];
  colors?: Record<string, string>;
  typography?: Record<string, string | number>;
  notes?: string[];
};

const inputPath = resolve(process.argv[2] || "visual-direction.json");
const outDir = resolve(process.argv[3] || ".");

function readDirection(): VisualDirection {
  try {
    return JSON.parse(readFileSync(inputPath, "utf8")) as VisualDirection;
  } catch {
    return {
      title: "Better PPT Style Preview",
      styleName: "editorial-tech",
      keywords: ["clear hierarchy", "premium spacing", "editable HTML"],
      colors: {
        background: "#0B0D12",
        surface: "#161A22",
        text: "#F5F7FA",
        muted: "#9AA4B2",
        accent: "#69D2E7"
      }
    };
  }
}

const direction = readDirection();
const colors = {
  background: direction.colors?.background || "#0B0D12",
  surface: direction.colors?.surface || "#161A22",
  text: direction.colors?.text || "#F5F7FA",
  muted: direction.colors?.muted || "#9AA4B2",
  accent: direction.colors?.accent || "#69D2E7"
};

mkdirSync(outDir, { recursive: true });

const css = `:root {
  --bg: ${colors.background};
  --surface: ${colors.surface};
  --text: ${colors.text};
  --muted: ${colors.muted};
  --accent: ${colors.accent};
}
* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.board {
  width: 1600px;
  height: 900px;
  padding: 48px 54px;
  display: grid;
  grid-template-columns: 1.18fr 1fr;
  gap: 28px;
  background:
    radial-gradient(circle at 18% 14%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 34%),
    var(--bg);
}
.cover, .panel {
  border: 1px solid color-mix(in srgb, var(--text) 14%, transparent);
  background: color-mix(in srgb, var(--surface) 86%, transparent);
  border-radius: 28px;
  overflow: hidden;
}
.cover {
  padding: 52px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.eyebrow { color: var(--accent); font-weight: 750; text-transform: uppercase; font-size: 18px; }
h1 { margin: 20px 0 0; font-size: 82px; line-height: .95; letter-spacing: 0; }
.subtitle { color: var(--muted); font-size: 28px; line-height: 1.35; max-width: 720px; }
.hero-line { height: 12px; width: 72%; background: linear-gradient(90deg, var(--accent), transparent); border-radius: 999px; }
.right { display: grid; grid-template-rows: 1fr 1fr .82fr; gap: 24px; }
.panel { padding: 24px 28px; }
.panel h2 { margin: 0 0 14px; font-size: 29px; }
.content-lines span { display: block; height: 14px; margin: 16px 0; border-radius: 999px; background: color-mix(in srgb, var(--text) 22%, transparent); }
.content-lines span:nth-child(2) { width: 78%; }
.content-lines span:nth-child(3) { width: 58%; }
.diagram { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; align-items: center; }
.node { min-height: 72px; border-radius: 18px; border: 1px solid color-mix(in srgb, var(--accent) 42%, transparent); display: grid; place-items: center; color: var(--text); }
.swatches { display: flex; gap: 12px; }
.swatch { width: 70px; height: 48px; border-radius: 14px; border: 1px solid color-mix(in srgb, var(--text) 18%, transparent); }
.keywords { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
.keywords span { padding: 7px 10px; border-radius: 999px; color: var(--muted); background: color-mix(in srgb, var(--text) 8%, transparent); font-size: 15px; }`;

const keywords = direction.keywords || ["premium", "clear", "editable"];
const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Style Preview</title>
  <link rel="stylesheet" href="./styleframe.css" />
</head>
<body>
  <main class="board">
    <section class="cover">
      <div>
        <div class="eyebrow">${direction.styleName || "Style Preview"}</div>
        <h1>${direction.title || "Better PPT HTML Deck"}</h1>
      </div>
      <p class="subtitle">A code-rendered visual board for approval before final HTML deck generation.</p>
      <div class="hero-line"></div>
    </section>
    <section class="right">
      <div class="panel">
        <h2>Content Slide</h2>
        <div class="content-lines"><span></span><span></span><span></span></div>
      </div>
      <div class="panel">
        <h2>Diagram Slide</h2>
        <div class="diagram"><div class="node">Input</div><div class="node">Agent</div><div class="node">Output</div></div>
      </div>
      <div class="panel">
        <h2>Tokens</h2>
        <div class="swatches">
          <div class="swatch" style="background:var(--bg)"></div>
          <div class="swatch" style="background:var(--surface)"></div>
          <div class="swatch" style="background:var(--text)"></div>
          <div class="swatch" style="background:var(--accent)"></div>
        </div>
        <div class="keywords">${keywords.map((item) => `<span>${item}</span>`).join("")}</div>
      </div>
    </section>
  </main>
</body>
</html>`;

writeFileSync(resolve(outDir, "styleframe.css"), css, "utf8");
writeFileSync(resolve(outDir, "styleframe.html"), html, "utf8");
console.log(`Wrote ${resolve(outDir, "styleframe.html")}`);
