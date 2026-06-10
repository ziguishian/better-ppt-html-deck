---
name: better-ppt-html-deck
description: Create better-looking, professional, editable HTML/CSS/JS slide decks. Use when the user asks to make a better-looking PPT, presentation, deck, slide deck, PowerPoint-style HTML deck, visually polished report, course deck, pitch deck, social carousel, or when they provide a topic/material/reference images and want Codex to plan content, choose a visual direction, generate a mandatory style preview for approval, then build an editable HTML deck with preview, present, PDF/PNG/image-PPTX export.
---

# Better PPT HTML Deck

Use this skill to help users quickly create better-looking PPT-style decks rendered from HTML/CSS/JS. The goal is not to build a general PPT workbench, SaaS design tool, Figma clone, or Canva clone. Editing, image replacement, preview, presenting, and export exist only to support fast creation and revision of a more beautiful, more professional deck.

## Hard Rules

- Generate a style preview before building the final deck project.
- Do not build the final `deck-project/` until the user explicitly approves `style-preview.png` or clearly says to proceed with that style.
- Render the final deck from HTML/CSS/JS. HTML is the source of truth; PDF, PNG, and PPTX are exports.
- Do not generate whole slides as static AI images. Image generation is allowed only for local visual assets such as cover hero art, background textures, illustrations, product concepts, or supporting images.
- Prefer HTML/CSS/SVG for diagrams, architecture drawings, terminal windows, code blocks, data cards, timelines, comparison tables, UI frames, charts, and layout.
- Keep all primary slide text in `src/data/deck.json`; do not hardcode main content inside components.
- Make the final deck directly editable: every visible title, subtitle, list item, card label, diagram label, code/prompt snippet, quote, speaker note, and image/logo must be editable or replaceable from Edit Mode.
- Include browser-side one-click PPTX export. Do not make users run a terminal command for the primary PPT export path.
- Include meaningful visual assets or image slots. A final deck with no replaceable images/visuals is incomplete unless the user explicitly requests text-only slides.

## Standard Workflow

### 1. Understand The Request

Infer or ask only for missing high-risk details. Capture:

- Topic, purpose, audience, scenario, page count, aspect ratio, language.
- Whether it is a formal report, course, pitch, product launch, training deck, or social carousel.
- Content density, visual preferences, uploaded materials, uploaded reference images.
- Defaults: `16:9`, Chinese, 8-12 slides when unspecified, and the goal of clearer structure plus stronger visual impact.

Use Fast Mode for quick drafts when requested. Use Pro Mode by default for formal work.

### 2. Plan Content

Create `outline.md` with:

- Deck title and narrative logic.
- One core point per slide.
- Slide title, information hierarchy, recommended slide type, likely visual assets, charts, diagrams, screenshots, code blocks, and visual notes.

Avoid dense small text and overloaded slides.

### 3. Define Visual Direction

If reference images are provided, analyze palette, layout, typography mood, component style, background style, image language, and visual emotion.

If no reference images are provided, infer a suitable visual direction from topic, audience, industry, and content tone. Browse or research only when current public facts or domain-specific visual conventions matter.

Create `visual-direction.md` with style name, rationale, colors, typography, layout rules, image style, component style, background style, and forbidden choices.

Read these references as needed:

- `references/design-principles.md`
- `references/visual-style-rules.md`
- `references/style-preview-guide.md`
- `references/style-feedback-map.md`

### 4. Generate Style Preview

This step is mandatory. Create a style board, not the final deck:

- `styleframe.html`
- `styleframe.css`
- `style-preview.png`

Prefer code-rendered HTML/CSS for the preview. Use image generation only for local visual assets inside the board. The board should show a cover preview, content slide preview, diagram/chart slide preview, palette, type, component treatment, icon style, and style keywords.

After producing `style-preview.png`, stop and ask for approval or feedback. Do not continue into final deck generation.

State flow:

```txt
draft -> style_preview_generated -> waiting_for_approval -> approved -> deck_building -> deck_ready
```

For revisions:

```txt
waiting_for_approval -> revision_requested -> style_preview_regenerated -> waiting_for_approval
```

Record preview revisions in `revision-log.md`:

```md
## v2 修改记录
- 用户反馈：
- 修改方向：
- 保留内容：
- 删除内容：
- 新视觉策略：
```

### 5. Lock Style And Content

After style approval, create `visual-lock.json`. Treat it as the visual contract for the final deck. Include style name, aspect ratio, colors, typography, layout tokens, component choices, image treatment, and visual rules.

After content direction is stable, create `content-lock.md` with deck goal, audience, final slide count, narrative, each slide's core point, type, title, summary, locked facts, and areas where wording may be optimized.

### 6. Build Final HTML Deck

Create `deck-project/` only after style approval. Prefer a React + Vite project unless the user or repo context clearly favors another stack.

Required structure:

```txt
deck-project/
├─ index.html
├─ package.json
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ data/deck.json
│  ├─ editor/
│  ├─ slides/
│  ├─ components/
│  ├─ theme/
│  ├─ utils/
│  └─ styles/global.css
├─ public/assets/
├─ scripts/
├─ exports/
└─ README.md
```

The deck must support:

- Edit Mode: click-to-edit title/body/list/notes, click or drag image/logo replacement, autosave to localStorage or IndexedDB, import/export `deck.json`.
- Preview Mode: hide editor controls and helpers; show near-export result.
- Present Mode: fullscreen, arrow keys, space for next, Esc exit, page number, progress, optional speaker notes.
- Export Mode: browser-side one-click image-based PPTX, PDF, per-slide PNG, `deck.json` import/export. The PPTX button must be visible in the app UI, not only documented as `npm run export:pptx`.
- Visual Assets: include at least one editable/replacable image or SVG visual on the cover and enough supporting visuals across the deck to avoid a text-only result. Register all visuals in `src/data/deck.json`.

Before considering the deck complete, perform an editability audit:

- Click-to-edit works for slide title, subtitle/body, list items, card headings, card bodies, diagram node labels, code/prompt text, quote text, closing CTA, and speaker notes.
- Image/logo/visual slots support click upload, drag upload, JPG/PNG/WebP/SVG, object-fit cover/contain where relevant, and local autosave.
- All edited values flow back to `deck.json` state and can be exported/imported.

Include README instructions for starting, editing text, replacing images, switching modes, exporting PDF/PNG/PPTX, importing/exporting `deck.json`, restoring defaults, changing theme colors, and adjusting aspect ratio.

### 7. Export And QA

Required commands in generated projects:

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

Run or provide `npm run validate` and `npm run screenshot`. Generate `qa-report.md`. Check tiny text, overflow, missing images, safe margins, visual consistency, one core point per slide, edit/preview/present/export modes, image replacement, browser-side one-click PPTX export, command-line PDF export, PNG export, and command-line PPTX export. Fix issues automatically when possible.

## Resource Guide

- `scripts/create-style-preview.ts`: create `styleframe.html` and `styleframe.css` from a visual direction.
- `scripts/export-style-preview.ts`: screenshot the style board into `style-preview.png`.
- `scripts/create-deck-project.ts`: scaffold the editable HTML deck project after approval.
- `scripts/export-pdf.ts`, `scripts/export-png.ts`, `scripts/export-pptx.ts`: export final HTML slides.
- `scripts/validate-deck.ts`: check deck data, text density, assets, and required commands.
- `scripts/screenshot-check.ts`: render screenshots and flag layout risks.
- `references/slide-patterns.md`: choose slide types.
- `references/component-system.md`: choose editable, visual, diagram, and technical components.
- `references/export-guide.md`: export architecture and priorities.
- `references/image-generation-guide.md`: rules for local visual assets.
- `references/quality-checklist.md`: final QA checklist.
- `agents/*.md`: role-specific guidance for content, visual, frontend, export, and QA passes.

## Example Invocation Flow

1. User: "帮我做一个更好看的 Codex 入门 PPT，10 页，科技发布会风格。"
2. Create `outline.md` and `visual-direction.md`.
3. Create `styleframe.html`, `styleframe.css`, and `style-preview.png`.
4. Ask: "这是审美预览图，确认这个方向后我再生成完整 HTML PPT 项目。"
5. If approved, create `visual-lock.json`, `content-lock.md`, and `deck-project/`.
6. Run validation, screenshots, exports, and produce `qa-report.md`.
