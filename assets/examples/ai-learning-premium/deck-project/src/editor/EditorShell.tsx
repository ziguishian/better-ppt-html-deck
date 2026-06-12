import type { ReactNode } from "react";
import type { Mode } from "../App";
import type { DeckData } from "../utils/storage";
import { ExportPanel } from "./ExportPanel";
import { SlideNavigator } from "./SlideNavigator";
import { Toolbar } from "./Toolbar";

type Props = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  deck: DeckData;
  setDeck: (deck: DeckData) => void;
  index: number;
  setIndex: (index: number) => void;
  reset: () => void;
  children: ReactNode;
};

export function EditorShell({ mode, setMode, deck, setDeck, index, setIndex, reset, children }: Props) {
  const chromeHidden = mode === "preview" || mode === "present";
  return (
    <div className={`app-shell mode-${mode}`}>
      {!chromeHidden && <Toolbar mode={mode} setMode={setMode} deck={deck} setDeck={setDeck} reset={reset} />}
      <main className="workspace">
        {!chromeHidden && <SlideNavigator deck={deck} index={index} setIndex={setIndex} />}
        <section className="stage-wrap">{children}</section>
        {mode === "export" && <ExportPanel deck={deck} />}
      </main>
    </div>
  );
}
