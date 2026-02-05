import { SessionData } from '../App';

const SESSIONS_KEY = 'onebit_sessions';
const DRAFT_KEY = 'onebit_draft';

export interface StoredSession extends SessionData {
  id: string;
  completed: boolean;
}

export function saveDraft(partial: Partial<SessionData>): void {
  try {
    const existing = loadDraft() || {};
    const updated = { ...existing, ...partial };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save draft:', e);
  }
}

export function loadDraft(): Partial<SessionData> | null {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load draft:', e);
  }
  return null;
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    console.error('Failed to clear draft:', e);
  }
}

export function appendToMentalDump(text: string): void {
  try {
    const draft = loadDraft() || {};
    const existing = draft.mentalDump || '';
    const updated = existing ? `${existing}\n${text}` : text;
    saveDraft({ mentalDump: updated });
  } catch (e) {
    console.error('Failed to append to mental dump:', e);
  }
}

export function saveCompletedSession(session: SessionData): void {
  try {
    const sessions = loadSessions();
    const newSession: StoredSession = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      completed: true,
      timestamp: Date.now(),
    };
    sessions.unshift(newSession);
    
    const trimmed = sessions.slice(0, 50);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save completed session:', e);
  }
}

export function loadSessions(): StoredSession[] {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load sessions:', e);
  }
  return [];
}

export function clearAllSessions(): void {
  try {
    localStorage.removeItem(SESSIONS_KEY);
  } catch (e) {
    console.error('Failed to clear sessions:', e);
  }
}
