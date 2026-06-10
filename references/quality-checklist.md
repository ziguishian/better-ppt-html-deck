# Quality Checklist

Run this before delivery.

## Visual

- Each slide has one core point.
- Titles are clear and strong.
- Text is large enough.
- No text overflow.
- Safe margins are respected.
- Whitespace is sufficient.
- Palette is consistent.
- Components and icons feel unified.
- Slides vary in structure without becoming chaotic.

## Editability

- Primary content lives in `src/data/deck.json`.
- Every visible text field can be edited in the browser: titles, subtitles, list items, card values, card labels, diagram labels, code/prompt snippets, quotes, CTAs, and notes.
- Images, logos, and supporting visual assets can be replaced.
- Edits autosave locally.
- `deck.json` can be exported and imported.

## Modes

- Edit mode exposes controls.
- Preview mode hides controls and helpers.
- Present mode supports fullscreen, arrow keys, space, Esc, progress, page number, optional notes.
- Export mode exposes PDF, PNG, PPTX, JSON options.

## Export

- Browser-side one-click PPTX export is visible and works.
- PDF export succeeds.
- PNG export produces one image per slide.
- PPTX export creates image-based slides.
- Export output matches preview.

## Assets

- No missing images.
- All generated images are logged.
- All visual assets are replaceable.

## Report

Create `qa-report.md` with findings, fixes performed, remaining risks, and export paths.
