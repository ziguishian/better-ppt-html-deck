import type { DeckData } from "../utils/storage";
import { downloadJson } from "../utils/exportDeck";
import { exportDeckToPptx } from "../utils/clientPptxExport";

export function ExportPanel({ deck }: { deck: DeckData }) {
  return (
    <aside className="export-panel">
      <h2>Export</h2>
      <button onClick={() => exportDeckToPptx(deck)}>One-click export PPTX</button>
      <button onClick={() => window.print()}>PDF via browser print</button>
      <button onClick={() => downloadJson(deck)}>Export deck.json</button>
      <p>Command exports:</p>
      <code>npm run export:pdf</code>
      <code>npm run export:png</code>
      <code>npm run export:pptx</code>
    </aside>
  );
}
