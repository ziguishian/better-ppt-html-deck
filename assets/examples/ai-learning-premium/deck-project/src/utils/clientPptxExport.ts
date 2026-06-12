import pptxgen from "pptxgenjs";
import type { DeckData } from "./storage";

const colors = {
  paper: "F7F3E8",
  ink: "111111",
  white: "FFFFFF",
  blue: "2F6BFF",
  yellow: "F6FF3D",
  pink: "FF4FB8",
  mint: "7CFFB2"
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

function addTitle(slide: pptxgen.Slide, title: string) {
  slide.addText(title, {
    x: 0.45,
    y: 0.38,
    w: 10.8,
    h: 1.05,
    fontFace: "Arial",
    bold: true,
    fontSize: title.length > 18 ? 32 : 46,
    color: colors.ink,
    fit: "shrink"
  });
}

function addBlock(slide: pptxgen.Slide, text: string, x: number, y: number, w: number, h: number, fill = colors.yellow, color = colors.ink) {
  slide.addShape("rect", {
    x,
    y,
    w,
    h,
    fill: { color: fill },
    line: { color: colors.ink, width: 2.4 },
    shadow: { type: "outer", color: colors.ink, opacity: 1, blur: 0, angle: 45, distance: 3 }
  });
  slide.addText(text, {
    x: x + 0.16,
    y: y + 0.15,
    w: w - 0.32,
    h: h - 0.3,
    fontFace: "Arial",
    bold: true,
    fontSize: 20,
    color,
    fit: "shrink",
    breakLine: false
  });
}

async function addVisual(slide: pptxgen.Slide, visual?: string) {
  const data = await imageToData(visual);
  if (data) slide.addImage({ data, x: 9.1, y: 4.6, w: 3.2, h: 2.1 });
}

export async function exportDeckToPptx(deck: DeckData) {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "better-ppt-html-deck";
  pptx.subject = "Editable HTML deck exported in browser";
  pptx.title = deck.deck.title;
  pptx.theme = {
    headFontFace: "Arial",
    bodyFontFace: "Arial",
    lang: "zh-CN"
  };

  for (const item of deck.slides) {
    const slide = pptx.addSlide();
    slide.background = { color: colors.paper };
    for (let x = 0; x < 13.34; x += 0.54) slide.addShape("line", { x, y: 0, w: 0, h: 7.5, line: { color: "E5DFD1", width: 0.5 } });
    for (let y = 0; y < 7.5; y += 0.54) slide.addShape("line", { x: 0, y, w: 13.34, h: 0, line: { color: "E5DFD1", width: 0.5 } });

    if (item.type === "cover") {
      addBlock(slide, item.kicker || "", 0.45, 0.48, 2.3, 0.42, colors.mint);
      slide.addText(item.title, { x: 0.45, y: 1.55, w: 5.2, h: 2.0, fontFace: "Arial", bold: true, fontSize: 60, color: colors.ink, breakLine: false, fit: "shrink" });
      addBlock(slide, item.subtitle || "", 0.45, 4.85, 6.2, 0.9, colors.blue, colors.white);
      addBlock(slide, item.tag || "EXECUTE", 10.5, 0.65, 1.7, 0.55, colors.yellow);
      await addVisual(slide, item.visual);
    } else {
      addTitle(slide, item.title);
      if (item.subtitle) addBlock(slide, item.subtitle, 0.55, 2.05, 6.6, 1.0, colors.blue, colors.white);
      if (item.quote) addBlock(slide, item.quote, 0.72, 2.3, 8.2, 1.5, colors.yellow);
      if (item.prompt) addBlock(slide, item.prompt, 0.55, 2.0, 7.2, 2.3, colors.ink, colors.mint);
      const list = item.items || item.steps || item.actions || item.chips || [];
      list.slice(0, 5).forEach((entry: string, index: number) => addBlock(slide, entry, 0.65 + index * 2.05, 4.78, 1.72, 0.75, index % 2 ? colors.yellow : colors.mint));
      if (item.leftTitle) {
        addBlock(slide, `${item.leftTitle}\n${(item.leftItems || []).join("\n")}`, 0.65, 2.05, 4.1, 2.5, colors.yellow);
        addBlock(slide, `${item.rightTitle}\n${(item.rightItems || []).join("\n")}`, 5.05, 2.05, 4.1, 2.5, colors.blue, colors.white);
      }
      if (item.layers) item.layers.slice(0, 4).forEach((layer: any, index: number) => addBlock(slide, `${layer.name}: ${layer.body}`, 0.65, 1.85 + index * 0.85, 7.8, 0.62, [colors.pink, colors.yellow, colors.mint, colors.blue][index], index === 3 ? colors.white : colors.ink));
      if (item.cards) item.cards.slice(0, 4).forEach((card: any, index: number) => addBlock(slide, `${card.value}\n${card.label}`, 0.65 + index * 2.12, 2.15, 1.75, 2.25, [colors.pink, colors.yellow, colors.mint, colors.blue][index], index === 3 ? colors.white : colors.ink));
      await addVisual(slide, item.visual);
    }
  }

  await pptx.writeFile({ fileName: `${deck.deck.title || "deck"}.pptx` });
}
