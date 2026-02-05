const REFLECTIONS_KEY = 'onebit_reflections';
const REFLECTION_SHOWN_KEY = 'onebit_reflection_shown';

interface Reflection {
  date: string;
  text: string;
}

let reflections: Reflection[] = [];
let shownDates: Set<string> = new Set();

function getTodayKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

export function loadReflections(): void {
  try {
    const stored = localStorage.getItem(REFLECTIONS_KEY);
    if (stored) {
      reflections = JSON.parse(stored);
    }
    
    const shownStored = localStorage.getItem(REFLECTION_SHOWN_KEY);
    if (shownStored) {
      shownDates = new Set(JSON.parse(shownStored));
    }
  } catch (e) {
    console.error('Failed to load reflections:', e);
  }
}

export function getReflections(): Reflection[] {
  if (reflections.length === 0) {
    loadReflections();
  }
  return reflections;
}

export function saveReflection(text: string): void {
  const today = getTodayKey();
  const existing = reflections.findIndex(r => r.date === today);
  
  if (existing >= 0) {
    reflections[existing].text = text;
  } else {
    reflections.push({ date: today, text });
  }
  
  try {
    localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections));
  } catch (e) {
    console.error('Failed to save reflection:', e);
  }
}

export function getReflectionForDate(date: string): string | null {
  const reflection = reflections.find(r => r.date === date);
  return reflection ? reflection.text : null;
}

export function shouldShowReflectionPrompt(): boolean {
  const today = getTodayKey();
  return !shownDates.has(today);
}

export function markReflectionShown(): void {
  const today = getTodayKey();
  shownDates.add(today);
  
  try {
    localStorage.setItem(REFLECTION_SHOWN_KEY, JSON.stringify([...shownDates]));
  } catch (e) {
    console.error('Failed to mark reflection shown:', e);
  }
}
