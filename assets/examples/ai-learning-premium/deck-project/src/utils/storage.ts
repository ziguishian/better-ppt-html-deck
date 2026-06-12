import seedDeck from "../data/deck.json";

export type DeckData = typeof seedDeck;

const key = "ai-learning-glass-product-deck-v1";

export function loadDeck(): DeckData {
  const stored = localStorage.getItem(key);
  if (!stored) return seedDeck;
  try {
    return JSON.parse(stored) as DeckData;
  } catch {
    return seedDeck;
  }
}

export function saveDeck(deck: DeckData) {
  localStorage.setItem(key, JSON.stringify(deck));
}

export function resetDeck(): DeckData {
  localStorage.removeItem(key);
  return seedDeck;
}
