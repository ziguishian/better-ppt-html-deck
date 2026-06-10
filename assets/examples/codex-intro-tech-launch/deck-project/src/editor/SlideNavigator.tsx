import type { DeckData } from "../utils/storage";

export function SlideNavigator({ deck, index, setIndex }: { deck: DeckData; index: number; setIndex: (index: number) => void }) {
  return (
    <aside className="slide-nav">
      {deck.slides.map((slide, slideIndex) => (
        <button key={slide.id} className={slideIndex === index ? "active" : ""} onClick={() => setIndex(slideIndex)}>
          <span>{String(slideIndex + 1).padStart(2, "0")}</span>
          {slide.title.split("\n")[0]}
        </button>
      ))}
    </aside>
  );
}
