# Style Preview Guide

Create `style-preview.png` as a visual board for approval before building the final deck.

## Required Files

- `styleframe.html`
- `styleframe.css`
- `style-preview.png`

## Recommended Composition

- Left: large cover slide preview with title treatment and hero visual language.
- Right top: content slide preview showing hierarchy and text density.
- Right middle: diagram, architecture, process, chart, or data slide preview.
- Right bottom: palette, typography, component styles, icon treatment.
- Bottom: style keywords.

## Acceptance Criteria

The user should be able to judge:

- Whether the cover has impact.
- Whether content pages are readable.
- Whether diagram/data pages feel professional.
- Whether the palette feels premium.
- Whether typography fits the topic.
- Whether image style matches the subject.
- Whether the whole style fits the deck purpose.

## Implementation Notes

- Render the board with HTML/CSS first.
- Screenshot with Playwright or an equivalent browser renderer.
- If image assets are generated, save them under the future deck path convention `public/assets/images/` or a clearly named preview assets folder.
- Do not treat the preview as final slide content.
