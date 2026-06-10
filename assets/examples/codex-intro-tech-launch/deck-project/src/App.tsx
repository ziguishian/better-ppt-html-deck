import { useEffect, useMemo, useState } from "react";
import { EditorShell } from "./editor/EditorShell";
import { SlideRenderer } from "./slides/SlideRenderer";
import { isEditableTarget } from "./utils/keyboard";
import { exitFullscreen } from "./utils/fullscreen";
import { loadDeck, resetDeck, saveDeck, type DeckData } from "./utils/storage";

export type Mode = "edit" | "preview" | "present" | "export";

function getInitialMode(): Mode {
  const mode = new URLSearchParams(location.search).get("mode");
  return mode === "preview" || mode === "present" || mode === "export" ? mode : "edit";
}

function getInitialSlide() {
  const slide = Number(new URLSearchParams(location.search).get("slide") || 1);
  return Number.isFinite(slide) ? Math.max(0, slide - 1) : 0;
}

export default function App() {
  const [deck, setDeck] = useState<DeckData>(() => loadDeck());
  const [mode, setMode] = useState<Mode>(() => getInitialMode());
  const [index, setIndex] = useState(() => Math.min(getInitialSlide(), loadDeck().slides.length - 1));

  const current = deck.slides[index] || deck.slides[0];

  useEffect(() => saveDeck(deck), [deck]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        setIndex((value) => Math.min(deck.slides.length - 1, value + 1));
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((value) => Math.max(0, value - 1));
      }
      if (event.key === "Escape") {
        setMode("preview");
        exitFullscreen();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deck.slides.length]);

  const progress = useMemo(() => `${index + 1} / ${deck.slides.length}`, [index, deck.slides.length]);

  function updateSlide(patch: Record<string, any>) {
    setDeck((value) => ({
      ...value,
      slides: value.slides.map((slide, slideIndex) => slideIndex === index ? { ...slide, ...patch } : slide)
    }));
  }

  return (
    <EditorShell
      mode={mode}
      setMode={setMode}
      deck={deck}
      setDeck={setDeck}
      index={index}
      setIndex={setIndex}
      reset={() => {
        setDeck(resetDeck());
        setIndex(0);
      }}
    >
      <div className="deck-stage">
        <SlideRenderer slide={current} mode={mode} onChange={updateSlide} />
      </div>
      <footer className="present-footer">
        <span>{progress}</span>
        <div><span style={{ width: `${((index + 1) / deck.slides.length) * 100}%` }} /></div>
      </footer>
      {mode === "present" && current.notes ? <aside className="speaker-notes">{current.notes}</aside> : null}
      <div className="export-render-root" aria-hidden="true">
        {deck.slides.map((slide) => (
          <div className="export-slide" key={slide.id}>
            <div className="deck-stage">
              <SlideRenderer slide={slide} mode="preview" onChange={() => undefined} />
            </div>
          </div>
        ))}
      </div>
    </EditorShell>
  );
}
