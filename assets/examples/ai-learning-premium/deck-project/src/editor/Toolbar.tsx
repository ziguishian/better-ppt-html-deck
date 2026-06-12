import { Download, FileDown, Maximize2, RotateCcw } from "lucide-react";
import type { Mode } from "../App";
import { downloadJson, importJson } from "../utils/exportDeck";
import { exportDeckToPptx } from "../utils/clientPptxExport";
import { enterFullscreen } from "../utils/fullscreen";
import type { DeckData } from "../utils/storage";
import { ModeSwitcher } from "./ModeSwitcher";

type Props = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  deck: DeckData;
  setDeck: (deck: DeckData) => void;
  reset: () => void;
};

export function Toolbar({ mode, setMode, deck, setDeck, reset }: Props) {
  async function exportPptx() {
    await exportDeckToPptx(deck);
  }

  return (
    <header className="toolbar">
      <strong>AI 学习 / Glass Product Deck</strong>
      <ModeSwitcher mode={mode} setMode={setMode} />
      <div className="toolbar-actions">
        <button title="One-click PPTX export" onClick={exportPptx}><FileDown size={18} /> PPTX</button>
        <button title="Export deck.json" onClick={() => downloadJson(deck)}><Download size={18} /> JSON</button>
        <label className="buttonlike">
          Import
          <input
            hidden
            type="file"
            accept="application/json"
            onChange={async (event) => {
              const file = event.currentTarget.files?.[0];
              if (file) setDeck(await importJson(file));
            }}
          />
        </label>
        <button title="Reset content" onClick={reset}><RotateCcw size={18} /> Reset</button>
        <button title="Fullscreen" onClick={enterFullscreen}><Maximize2 size={18} /> Full</button>
      </div>
    </header>
  );
}
