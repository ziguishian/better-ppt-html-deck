import { EditableText } from "../editor/EditableText";
import { EditableImage } from "../editor/EditableImage";
import type { Mode } from "../App";

type Slide = Record<string, any>;

type Props = {
  slide: Slide;
  mode: Mode;
  onChange: (patch: Partial<Slide>) => void;
};

const disabledModes = new Set(["preview", "present", "export"]);

function Text({ slide, field, className, mode, onChange, multiline }: Props & { field: string; className?: string; multiline?: boolean }) {
  return (
    <EditableText
      value={String(slide[field] || "")}
      className={className}
      multiline={multiline}
      disabled={disabledModes.has(mode)}
      onChange={(value) => onChange({ [field]: value })}
    />
  );
}

function ChipList({ items }: { items: string[] }) {
  return <div className="chip-list">{items.map((item) => <span key={item}>{item}</span>)}</div>;
}

function EditableList({ items, className, mode, onChange }: { items: string[]; className: string; mode: Mode; onChange: (items: string[]) => void }) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <EditableText
          key={index}
          value={item}
          disabled={disabledModes.has(mode)}
          onChange={(value) => onChange(items.map((entry, entryIndex) => entryIndex === index ? value : entry))}
        />
      ))}
    </div>
  );
}

function EditableOrderedList({ items, className, mode, onChange }: { items: string[]; className: string; mode: Mode; onChange: (items: string[]) => void }) {
  return (
    <ol className={className}>
      {items.map((item, index) => (
        <li key={index}>
          <EditableText
            value={item}
            disabled={disabledModes.has(mode)}
            onChange={(value) => onChange(items.map((entry, entryIndex) => entryIndex === index ? value : entry))}
          />
        </li>
      ))}
    </ol>
  );
}

function updateObjectList(items: any[], index: number, patch: Record<string, string>) {
  return items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item);
}

function VisualAsset({ slide, mode, onChange }: Props) {
  return (
    <div className="visual-asset">
      <EditableImage
        src={slide.visual}
        disabled={disabledModes.has(mode)}
        label="替换配图"
        onChange={(visual) => onChange({ visual })}
      />
    </div>
  );
}

function Notes({ slide, mode, onChange }: Props) {
  if (disabledModes.has(mode)) return null;
  return (
    <div className="notes-editor">
      <strong>Notes</strong>
      <EditableText value={slide.notes || ""} onChange={(notes) => onChange({ notes })} />
    </div>
  );
}

export function SlideRenderer(props: Props) {
  const { slide, mode, onChange } = props;
  const common = { slide, mode, onChange };

  if (slide.type === "cover") {
    return (
      <article className="slide cover-slide">
        <div className="sticker">{slide.tag}</div>
        <Text {...common} field="kicker" className="kicker" />
        <Text {...common} field="title" className="cover-title" multiline />
        <Text {...common} field="subtitle" className="cover-subtitle" />
        <VisualAsset {...common} />
        <div className="stripe" />
        <Notes {...common} />
      </article>
    );
  }

  if (slide.type === "big-idea") {
    return (
      <article className="slide big-idea-slide">
        <Text {...common} field="kicker" className="kicker" />
        <Text {...common} field="title" className="mega-title" />
        <Text {...common} field="subtitle" className="statement blue-block" />
        <EditableList items={slide.chips || []} className="chip-list" mode={mode} onChange={(chips) => onChange({ chips })} />
        <VisualAsset {...common} />
        <Notes {...common} />
      </article>
    );
  }

  if (slide.type === "comparison") {
    return (
      <article className="slide comparison-slide">
        <Text {...common} field="title" className="slide-title" />
        <div className="comparison-grid">
          <div className="brut-card yellow">
            <h2><Text {...common} field="leftTitle" /></h2>
            {(slide.leftItems || []).map((item: string, itemIndex: number) => (
              <p key={itemIndex}>
                <EditableText value={item} disabled={disabledModes.has(mode)} onChange={(value) => onChange({ leftItems: slide.leftItems.map((entry: string, index: number) => index === itemIndex ? value : entry) })} />
              </p>
            ))}
          </div>
          <div className="brut-card blue">
            <h2><Text {...common} field="rightTitle" /></h2>
            {(slide.rightItems || []).map((item: string, itemIndex: number) => (
              <p key={itemIndex}>
                <EditableText value={item} disabled={disabledModes.has(mode)} onChange={(value) => onChange({ rightItems: slide.rightItems.map((entry: string, index: number) => index === itemIndex ? value : entry) })} />
              </p>
            ))}
          </div>
        </div>
        <VisualAsset {...common} />
        <Notes {...common} />
      </article>
    );
  }

  if (slide.type === "process") {
    return (
      <article className="slide process-slide">
        <Text {...common} field="title" className="slide-title" />
        <div className="process-row">
          {(slide.steps || []).map((step: string, index: number) => (
            <div className="process-node" key={step}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <EditableText
                value={step}
                disabled={disabledModes.has(mode)}
                onChange={(value) => onChange({ steps: slide.steps.map((entry: string, entryIndex: number) => entryIndex === index ? value : entry) })}
              />
            </div>
          ))}
        </div>
        <VisualAsset {...common} />
        <Notes {...common} />
      </article>
    );
  }

  if (slide.type === "architecture") {
    return (
      <article className="slide architecture-slide">
        <Text {...common} field="title" className="slide-title" />
        <div className="architecture-stack">
          {(slide.layers || []).map((layer: any, index: number) => (
            <div className={`layer layer-${index}`} key={layer.name}>
              <strong><EditableText value={layer.name} disabled={disabledModes.has(mode)} onChange={(name) => onChange({ layers: updateObjectList(slide.layers, index, { name }) })} /></strong>
              <EditableText value={layer.body} disabled={disabledModes.has(mode)} onChange={(body) => onChange({ layers: updateObjectList(slide.layers, index, { body }) })} />
            </div>
          ))}
        </div>
        <VisualAsset {...common} />
        <Notes {...common} />
      </article>
    );
  }

  if (slide.type === "code-demo") {
    return (
      <article className="slide code-demo-slide">
        <Text {...common} field="title" className="slide-title" />
        <div className="code-layout">
          <pre><code><Text {...common} field="prompt" /></code></pre>
          <EditableList items={slide.actions || []} className="action-list" mode={mode} onChange={(actions) => onChange({ actions })} />
        </div>
        <VisualAsset {...common} />
        <Notes {...common} />
      </article>
    );
  }

  if (slide.type === "data-dashboard") {
    return (
      <article className="slide data-slide">
        <Text {...common} field="title" className="slide-title" />
        <div className="metric-grid">
          {(slide.cards || []).map((card: any) => (
            <div className="metric-card" key={card.value}>
              <strong><EditableText value={card.value} disabled={disabledModes.has(mode)} onChange={(value) => onChange({ cards: updateObjectList(slide.cards, slide.cards.indexOf(card), { value }) })} /></strong>
              <EditableText value={card.label} disabled={disabledModes.has(mode)} onChange={(label) => onChange({ cards: updateObjectList(slide.cards, slide.cards.indexOf(card), { label }) })} />
            </div>
          ))}
        </div>
        <VisualAsset {...common} />
        <Notes {...common} />
      </article>
    );
  }

  if (slide.type === "checklist") {
    return (
      <article className="slide checklist-slide">
        <Text {...common} field="title" className="slide-title" />
        <EditableOrderedList items={slide.items || []} className="check-list" mode={mode} onChange={(items) => onChange({ items })} />
        <VisualAsset {...common} />
        <Notes {...common} />
      </article>
    );
  }

  if (slide.type === "quote") {
    return (
      <article className="slide quote-slide">
        <Text {...common} field="title" className="slide-title compact" />
        <Text {...common} field="quote" className="quote-text" />
        <VisualAsset {...common} />
        <Notes {...common} />
      </article>
    );
  }

  return (
    <article className="slide closing-slide">
      <Text {...common} field="title" className="slide-title" />
      <Text {...common} field="subtitle" className="statement yellow-block" />
      <EditableList items={slide.items || []} className="closing-items" mode={mode} onChange={(items) => onChange({ items })} />
      <VisualAsset {...common} />
      <Notes {...common} />
    </article>
  );
}
