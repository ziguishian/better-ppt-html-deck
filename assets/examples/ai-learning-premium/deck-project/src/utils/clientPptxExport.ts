import pptxgen from "pptxgenjs";
import type { DeckData } from "./storage";

const colors = {
  paper: "F5F8FF",
  ink: "111827",
  white: "FFFFFF",
  blue: "3B82F6",
  cyan: "44D7B6",
  gold: "F2C86B",
  violet: "7C6FF6",
  muted: "5F6B7A",
  line: "CFE0F8",
  dark: "1F2937"
};

async function imageToData(path?: string) {
  if (!path) return undefined;
  if (path.startsWith("data:")) return path;
  const response = await fetch(path);
  const blob = await response.blob();
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
}

function addGrid(slide: pptxgen.Slide) {
  slide.background = { color: colors.paper };
  for (let x = 0; x < 13.34; x += 0.54) {
    slide.addShape("line", { x, y: 0, w: 0, h: 7.5, line: { color: "E7EEF9", width: 0.35, transparency: 25 } });
  }
  for (let y = 0; y < 7.5; y += 0.54) {
    slide.addShape("line", { x: 0, y, w: 13.34, h: 0, line: { color: "E7EEF9", width: 0.35, transparency: 25 } });
  }
  slide.addShape("ellipse", { x: 11.45, y: 5.82, w: 2.15, h: 2.15, line: { color: "D8E7FF", transparency: 100, width: 0 }, fill: { color: "D8E7FF", transparency: 42 } });
}

function addLabel(slide: pptxgen.Slide, text: string, x: number, y: number, w = 1.95) {
  slide.addText(text, {
    x,
    y,
    w,
    h: 0.34,
    margin: 0.06,
    fontFace: "Arial",
    bold: true,
    fontSize: 10,
    color: "175BBD",
    align: "center",
    fit: "shrink",
    fill: { color: colors.white, transparency: 10 },
    line: { color: colors.line, width: 1 }
  });
}

function addTitle(slide: pptxgen.Slide, title: string, y = 0.54, w = 8.8) {
  slide.addText(title, {
    x: 0.48,
    y,
    w,
    h: 0.9,
    margin: 0,
    fontFace: "Arial",
    bold: true,
    fontSize: title.length > 14 ? 38 : 52,
    color: colors.ink,
    breakLine: false,
    fit: "shrink"
  });
}

function addGlassBlock(slide: pptxgen.Slide, text: string, x: number, y: number, w: number, h: number, opts: { accent?: string; dark?: boolean; fontSize?: number } = {}) {
  const fill = opts.dark ? colors.dark : colors.white;
  const color = opts.dark ? "DFF8FF" : (opts.accent || colors.ink);
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: fill, transparency: opts.dark ? 0 : 10 },
    line: { color: opts.accent || colors.line, width: 1 },
    shadow: { type: "outer", color: "93B4E6", opacity: 0.13, blur: 2, angle: 45, distance: 1.2 }
  });
  slide.addText(text, {
    x: x + 0.16,
    y: y + 0.12,
    w: w - 0.32,
    h: h - 0.24,
    fontFace: "Arial",
    bold: true,
    fontSize: opts.fontSize || 17,
    color,
    fit: "shrink",
    breakLine: false,
    valign: "mid"
  });
}

async function addVisual(slide: pptxgen.Slide, visual?: string, x = 9.75, y = 4.95, w = 2.7, h = 1.55) {
  const data = await imageToData(visual);
  if (data) {
    slide.addImage({ data, x, y, w, h });
  }
}

function addChips(slide: pptxgen.Slide, items: string[], x: number, y: number) {
  items.slice(0, 5).forEach((entry, index) => {
    const palette = [colors.blue, colors.cyan, colors.gold, colors.violet, colors.blue];
    addGlassBlock(slide, entry, x + index * 1.48, y, 1.28, 0.44, { accent: palette[index], fontSize: 12 });
  });
}

export async function exportDeckToPptx(deck: DeckData) {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "better-ppt-html-deck";
  pptx.subject = "Editable AI learning deck exported in browser";
  pptx.title = deck.deck.title;
  pptx.theme = {
    headFontFace: "Arial",
    bodyFontFace: "Arial",
    lang: "zh-CN"
  };

  for (const item of deck.slides) {
    const slide = pptx.addSlide();
    addGrid(slide);

    if (item.type === "cover") {
      addLabel(slide, item.kicker || "AI LEARNING OS", 0.48, 0.55, 1.55);
      addLabel(slide, item.tag || "START", 11.72, 0.68, 0.9);
      slide.addText(item.title, {
        x: 0.48,
        y: 4.38,
        w: 4.95,
        h: 1.12,
        margin: 0,
        fontFace: "Arial",
        bold: true,
        fontSize: 70,
        color: colors.ink,
        fit: "shrink"
      });
      addGlassBlock(slide, item.subtitle || "", 0.48, 5.75, 6.25, 0.92, { fontSize: 20, accent: colors.line });
      await addVisual(slide, item.visual, 7.15, 1.48, 5.58, 3.7);
      slide.addShape("line", { x: 0.48, y: 7.05, w: 3.55, h: 0, line: { color: colors.blue, width: 5, beginArrowType: "none", endArrowType: "none" } });
      continue;
    }

    addTitle(slide, item.title);

    if (item.type === "big-idea") {
      addGlassBlock(slide, item.subtitle || "", 0.56, 2.05, 6.85, 1.1, { fontSize: 18, accent: colors.line });
      addChips(slide, item.chips || [], 0.56, 3.55);
      await addVisual(slide, item.visual, 9.65, 0.95, 2.85, 1.8);
      continue;
    }

    if (item.type === "comparison") {
      addGlassBlock(slide, `${item.leftTitle}\n${(item.leftItems || []).join("\n")}`, 0.62, 1.95, 4.2, 2.75, { accent: colors.line, fontSize: 16 });
      addGlassBlock(slide, `${item.rightTitle}\n${(item.rightItems || []).join("\n")}`, 5.1, 1.95, 4.2, 2.75, { accent: colors.blue, fontSize: 16 });
      await addVisual(slide, item.visual);
      continue;
    }

    if (item.layers) {
      item.layers.slice(0, 4).forEach((layer: any, index: number) => {
        const palette = [colors.blue, colors.cyan, colors.gold, colors.violet];
        addGlassBlock(slide, `${String(index + 1).padStart(2, "0")}  ${layer.name}\n${layer.body}`, 0.62, 1.65 + index * 0.86, 7.9, 0.64, { accent: palette[index], fontSize: 13 });
      });
      await addVisual(slide, item.visual);
      continue;
    }

    if (item.steps) {
      item.steps.slice(0, 5).forEach((step: string, index: number) => {
        const palette = [colors.blue, colors.cyan, colors.gold, colors.violet, colors.blue];
        addGlassBlock(slide, `${String(index + 1).padStart(2, "0")}\n${step}`, 0.62 + index * 1.68, 2.25, 1.42, 1.58, { accent: palette[index], fontSize: 16 });
      });
      await addVisual(slide, item.visual);
      continue;
    }

    if (item.prompt) {
      addGlassBlock(slide, item.prompt, 0.62, 1.62, 5.35, 3.35, { dark: true, fontSize: 15 });
      (item.actions || []).slice(0, 4).forEach((entry: string, index: number) => {
        addGlassBlock(slide, entry, 6.25, 1.62 + index * 0.84, 3.05, 0.58, { accent: [colors.blue, colors.cyan, colors.gold, colors.violet][index], fontSize: 16 });
      });
      await addVisual(slide, item.visual);
      continue;
    }

    if (item.cards) {
      item.cards.slice(0, 4).forEach((card: any, index: number) => {
        addGlassBlock(slide, `${card.value}\n${card.label}`, 0.62 + index * 2.18, 2.05, 1.9, 2.2, { accent: [colors.blue, colors.cyan, colors.gold, colors.violet][index], fontSize: 14 });
      });
      await addVisual(slide, item.visual);
      continue;
    }

    if (item.items) {
      item.items.slice(0, 5).forEach((entry: string, index: number) => {
        addGlassBlock(slide, `${String(index + 1).padStart(2, "0")}  ${entry}`, 0.62, 1.72 + index * 0.72, 8.75, 0.52, { accent: colors.line, fontSize: 15 });
      });
      await addVisual(slide, item.visual);
      continue;
    }

    if (item.subtitle) {
      addGlassBlock(slide, item.subtitle, 0.62, 3.85, 6.25, 0.92, { fontSize: 18 });
      addChips(slide, item.items || [], 0.62, 5.25);
    }
    await addVisual(slide, item.visual);
  }

  await pptx.writeFile({ fileName: `${deck.deck.title || "AI 学习"}.pptx` });
}
