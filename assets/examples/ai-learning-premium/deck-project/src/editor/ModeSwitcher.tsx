import type { Mode } from "../App";

export function ModeSwitcher({ mode, setMode }: { mode: Mode; setMode: (mode: Mode) => void }) {
  return (
    <div className="mode-switcher" role="tablist" aria-label="Mode">
      {(["edit", "preview", "present", "export"] as Mode[]).map((item) => (
        <button key={item} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>
          {item}
        </button>
      ))}
    </div>
  );
}
