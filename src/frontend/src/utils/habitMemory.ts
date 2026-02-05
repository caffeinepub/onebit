import { StoredSession } from '../store/sessionStore';

export function computeHabitMemory(sessions: StoredSession[]): number {
  const now = new Date();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  
  const recentSessions = sessions.filter(s => s.timestamp >= fourteenDaysAgo.getTime());
  
  const uniqueDates = new Set<string>();
  recentSessions.forEach(session => {
    const date = new Date(session.timestamp);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    uniqueDates.add(dateKey);
  });
  
  return uniqueDates.size;
}
