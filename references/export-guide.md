# Export Guide

## Export Priority

- V1: browser-side one-click image-based PPTX from the app UI.
- V1: PDF.
- V1: per-slide PNG.
- V1: command-line image-based PPTX.
- V2: editable PPTX, only when the user explicitly needs it and the visual system can survive conversion.

## Recommended V1 PPTX

Use:

```txt
HTML slide screenshot -> high-resolution slide image -> insert image into PPTX
```

Reasons:

- Preserves visual consistency.
- Avoids layout drift.
- Produces stable deliverables.
- Keeps HTML as the editable source and PPTX as an exchange/export file.

## Required Commands

Generated deck projects should provide:

```txt
npm run dev
npm run build
npm run preview
npm run export:pdf
npm run export:png
npm run export:pptx
npm run validate
npm run screenshot
```

## In-App Export Requirement

Generated decks must include a visible `PPTX` button in the toolbar or export panel. The button should:

- Render all slides offscreen at the target aspect ratio.
- Capture each slide as an image.
- Insert each image into a wide-layout PPTX.
- Download the PPTX directly in the browser.

Keep command-line exports as a reliable fallback, but do not make the terminal the only way to export PPTX.

## Output Paths

```txt
exports/
├─ deck.pdf
├─ deck.pptx
└─ images/
   ├─ slide-001.png
   ├─ slide-002.png
   └─ slide-003.png
```
