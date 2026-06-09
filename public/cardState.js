// Tech Spec §APIs & contracts — pure client state module (no DOM, no localStorage).
// Lives in public/ so the browser can import it as a static ES module.
// Tests import it from ../public/cardState.js via node:test.

export const STORAGE_KEY = 'aiconbingo:v1';
export const NAME_MAX = 40;

export function normalizeName(name) {
  if (typeof name !== 'string') return '';
  return name.trim().slice(0, NAME_MAX);
}

export function buildState(card, name = '') {
  const marked = Array(25).fill(false);
  marked[12] = true;
  return { version: 1, card: [...card], marked, name: normalizeName(name) };
}

export function serialize(state) {
  return JSON.stringify(state);
}

export function deserialize(raw) {
  if (raw == null || raw === '') return null;
  try {
    const s = JSON.parse(raw);
    if (s.version !== 1) return null;
    if (!Array.isArray(s.card) || s.card.length !== 25) return null;
    if (!s.card.every(c => typeof c === 'string')) return null;
    if (!Array.isArray(s.marked) || s.marked.length !== 25) return null;
    if (!s.marked.every(m => typeof m === 'boolean')) return null;
    if (s.marked[12] !== true) return null;
    if (typeof s.name !== 'string') return null;
    return s;
  } catch {
    return null;
  }
}
