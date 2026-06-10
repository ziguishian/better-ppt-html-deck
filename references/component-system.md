# Component System

Build a small, coherent component set. Do not turn the project into a full design editor.

## Editing And Shell Components

- `EditableText`: click-to-edit text with autosave. Use it for every visible text field, including nested list items, card labels, diagram labels, code/prompt snippets, quotes, CTAs, and speaker notes.
- `EditableImage`: click and drag upload, restore default, cover/contain fit. Use it for cover visuals, supporting illustrations, screenshots, logos, and any generated/local visual asset.
- `SlideCanvas`: fixed-aspect slide viewport.
- `SlideFrame`: safe margins, background, theme tokens.
- `Toolbar`: compact mode and export controls.
- `ModeSwitcher`: edit, preview, present, export.
- `SlideNavigator`: thumbnail or slide list in edit mode.
- `ExportPanel`: visible one-click PPTX export, PDF/PNG export entries, and import/export deck JSON.
- `ProgressBar`: present-mode progress.
- `SpeakerNotes`: optional notes panel.

## Visual Components

- `GlassCard`: use only when the chosen style supports glass; avoid overuse.
- `GradientBlob`: use sparingly as background atmosphere, never as the main design idea.
- `DotGridBackground`: subtle structure for technical decks.
- `NoiseTexture`: premium texture, very low opacity.
- `FloatingPanel`: layered content region.
- `BrowserFrame`: web/product screenshot frame.
- `MacWindow`: app-like frame for UI examples.
- `TerminalWindow`: command/output frame.
- `FileTree`: code project structure.
- `CodeBlock`: readable syntax block with large text.
- `IconBadge`: consistent simple icon treatment.
- `NumberCard`: large metric or step number.
- `QuoteBlock`: quote with clear attribution.
- `VisualAssetSlot`: framed, replaceable image/SVG region tied to a `deck.json` field.
- `OneClickPptxButton`: browser-side export button that captures rendered slides and downloads an image-based PPTX.

## Diagram Components

- `ProcessDiagram`
- `TimelineDiagram`
- `ArchitectureDiagram`
- `AgentLoopDiagram`
- `ComparisonDiagram`
- `PipelineDiagram`
- `HumanInTheLoopDiagram`

Diagrams should be code-rendered with HTML/CSS/SVG and remain editable.

## Technical Deck Components

- `CodeAgentArchitecture`
- `PromptCard`
- `WorkflowPipeline`
- `ToolCallingDiagram`
- `ModelComparison`
- `TerminalCommandBlock`

Use these for AI, developer tooling, workflow, and architecture decks.
