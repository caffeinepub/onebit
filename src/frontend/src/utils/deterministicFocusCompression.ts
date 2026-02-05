import { Blocker, TimeBucket } from '../App';

interface CompressionResult {
  action: string;
  fallback: string | null;
}

interface Candidate {
  text: string;
  score: number;
  estimatedMinutes: number;
}

const COMMON_VERBS = [
  'write', 'call', 'email', 'draft', 'finish', 'read', 'submit', 
  'book', 'plan', 'create', 'open', 'review', 'complete', 'start',
  'send', 'reply', 'schedule', 'organize', 'prepare', 'update'
];

function containsVerb(text: string): boolean {
  const lower = text.toLowerCase();
  return COMMON_VERBS.some(verb => lower.includes(verb));
}

function estimateMinutes(text: string): number {
  const lower = text.toLowerCase();
  
  // Check for explicit time mentions
  const timeMatch = lower.match(/(\d+)\s*(min|minute|hour|hr)/);
  if (timeMatch) {
    const num = parseInt(timeMatch[1]);
    const unit = timeMatch[2];
    if (unit.startsWith('hour') || unit === 'hr') {
      return num * 60;
    }
    return num;
  }
  
  // Heuristic based on task type
  if (/(write|draft|design|build|code|develop|create)/i.test(lower)) return 20;
  if (/(email|reply|call|book|pay|buy|send)/i.test(lower)) return 10;
  if (/(review|read|study|research|analyze)/i.test(lower)) return 30;
  
  return 15; // default fallback
}

function scoreCandidate(text: string): number {
  let score = 0;
  
  // Verb presence (most important)
  if (containsVerb(text)) score += 3;
  
  // Urgency indicators
  if (/\b(urgent|asap|now|today|immediately)\b/i.test(text)) score += 2;
  
  // Time-bounded mentions
  if (/\d+\s*(min|minute|hour|hr)/i.test(text)) score += 2;
  
  // Shorter, actionable lines get a boost
  if (text.length < 60 && text.length > 10) score += 1;
  
  // Penalize very long lines (likely not a single task)
  if (text.length > 150) score -= 2;
  
  return score;
}

export function focusCompress(
  rawText: string,
  blocker: Blocker,
  timeBucket: TimeBucket
): CompressionResult {
  // Handle empty input
  if (!rawText || !rawText.trim()) {
    return {
      action: 'Pick one small thing (e.g., "Open blank doc")',
      fallback: null,
    };
  }

  // Split by common separators
  const lines = rawText
    .split(/\r?\n|[,;]/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // If only one line, use it
  if (lines.length === 1) {
    return {
      action: lines[0],
      fallback: null,
    };
  }

  // Score all candidates
  const candidates: Candidate[] = lines.map(line => ({
    text: line,
    score: scoreCandidate(line),
    estimatedMinutes: estimateMinutes(line),
  }));

  // Filter to candidates that fit the time bucket
  let filtered = candidates.filter(c => c.estimatedMinutes <= timeBucket);
  
  // If nothing fits, use all candidates
  if (filtered.length === 0) {
    filtered = candidates;
  }

  // Sort by score (descending), then by length (ascending)
  filtered.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.text.length - b.text.length;
  });

  // Return primary and fallback
  const primary = filtered[0];
  const fallback = filtered.length > 1 ? filtered[1].text : null;

  return {
    action: primary.text,
    fallback,
  };
}
