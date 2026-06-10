# Image Generation Guide

Image generation is allowed only for local visual assets, not whole PPT slides.

## Allowed Uses

- Cover hero visual.
- Abstract background or texture.
- Illustration.
- Product concept image.
- Mood image.
- Supporting image for a specific slide.

## Prefer Code For

- Layout.
- Flowcharts.
- Architecture diagrams.
- Charts.
- UI frames.
- Data cards.
- Timelines.
- Comparison tables.
- Code and terminal windows.

## Asset Rules

- Every finished deck should include meaningful visual assets or editable image slots unless the user explicitly asks for a text-only deck.
- The cover must include a replaceable visual asset, hero image, SVG illustration, or product/screenshot frame.
- Most non-section slides should include either a code-rendered diagram/data visual or a replaceable supporting visual. Avoid text-only slide runs.
- Save generated images under `public/assets/images`.
- Register every image in `src/data/deck.json`.
- Make every image replaceable through `EditableImage`.
- Output `image-prompts.md` and `asset-source-log.md`.

## Log Format

```md
## asset-name.png
- Purpose:
- Prompt:
- Used in:
- File path:
- Replacement suggestion:
```
