const DAILY_ANCHOR_KEY = 'onebit_daily_anchors';

const DEFAULT_ANCHORS = [
  "You don't need to do everything. Just one thing.",
  "Progress is choosing one step, not planning all of them.",
  "What matters most can wait. What matters now cannot.",
  "Clarity comes from action, not from thinking about action.",
  "You're not behind. You're exactly where you need to be.",
  "One focused moment is worth more than a distracted hour.",
  "Let go of perfect. Start with possible.",
];

let anchors: string[] = [];

export function loadDailyAnchors(): void {
  try {
    const stored = localStorage.getItem(DAILY_ANCHOR_KEY);
    if (stored) {
      anchors = JSON.parse(stored);
    } else {
      anchors = [...DEFAULT_ANCHORS];
    }
  } catch (e) {
    console.error('Failed to load daily anchors:', e);
    anchors = [...DEFAULT_ANCHORS];
  }
}

export function getDailyAnchors(): string[] {
  if (anchors.length === 0) {
    loadDailyAnchors();
  }
  return anchors;
}

export function setDailyAnchors(newAnchors: string[]): void {
  anchors = newAnchors;
  try {
    localStorage.setItem(DAILY_ANCHOR_KEY, JSON.stringify(anchors));
  } catch (e) {
    console.error('Failed to save daily anchors:', e);
  }
}

export function getTodaysAnchor(): string {
  const list = getDailyAnchors();
  if (list.length === 0) return DEFAULT_ANCHORS[0];
  
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % list.length;
  
  return list[index];
}
