# Image Generation Guide

Image generation is allowed only for local visual assets, not whole PPT slides. Prefer GPT Image / built-in image generation for bitmap assets that need richer texture, mood, photographic detail, poster illustration, product concept art, or editorial imagery. Do not substitute simple SVG placeholders when the deck clearly needs a polished bitmap visual.

## Allowed Uses

- Cover hero visual.
- Abstract background or texture.
- Illustration.
- Product concept image.
- Mood image.
- Supporting image for a specific slide.

## When To Use GPT Image

Use GPT Image / built-in image generation by default when:

- The deck needs a strong cover hero, campaign visual, product concept, mood image, editorial illustration, or textured background.
- The user explicitly asks for image generation, GPT Image, gpt-image-2, AI-generated visuals, bitmap assets, photorealistic visuals, or richer non-SVG artwork.
- The selected style would feel weak with only geometric SVGs.
- The visual direction calls for texture, atmosphere, realistic material, collage, characters, product shots, or visual metaphor.

Do not use GPT Image for full-slide screenshots, complete PPT pages, flowcharts, architecture diagrams, data cards, code blocks, terminal windows, editable UI frames, or text-heavy diagrams. Those remain code-rendered.

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
- Never leave a generated project asset only under the image tool's default output folder. Copy it into the deck project before referencing it.
- For each generated image, record whether it came from built-in image generation or CLI fallback.

## Log Format

```md
## asset-name.png
- Purpose:
- Prompt:
- Used in:
- File path:
- Replacement suggestion:
```
