import { Blocker, TimeBucket } from '../App';

interface CompressionResult {
  action: string;
  fallback: string | null;
  rationale: string;
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
  
  const timeMatch = lower.match(/(\d+)\s*(min|minute|hour|hr)/);
  if (timeMatch) {
    const num = parseInt(timeMatch[1]);
    const unit = timeMatch[2];
    if (unit.startsWith('hour') || unit === 'hr') {
      return num * 60;
    }
    return num;
  }
  
  if (/(write|draft|design|build|code|develop|create)/i.test(lower)) return 20;
  if (/(email|reply|call|book|pay|buy|send)/i.test(lower)) return 10;
  if (/(review|read|study|research|analyze)/i.test(lower)) return 30;
  
  return 15;
}

function scoreCandidate(text: string): number {
  let score = 0;
  
  if (containsVerb(text)) score += 3;
  if (/\b(urgent|asap|now|today|immediately)\b/i.test(text)) score += 2;
  if (/\d+\s*(min|minute|hour|hr)/i.test(text)) score += 2;
  if (text.length < 60 && text.length > 10) score += 1;
  if (text.length > 150) score -= 2;
  
  return score;
}

function generateRationale(blocker: Blocker, timeBucket: TimeBucket, action: string): string {
  const blockerReasons: Record<Blocker, string> = {
    too_many: 'Picked the most actionable from your list',
    low_energy: 'Chose something achievable with low energy',
    avoiding: 'Selected a concrete first step',
    urgent: 'Prioritized by urgency',
  };

  return `${blockerReasons[blocker]} for ${timeBucket} minutes.`;
}

export function focusCompress(
  rawText: string,
  blocker: Blocker,
  timeBucket: TimeBucket
): CompressionResult {
  if (!rawText || !rawText.trim()) {
    return {
      action: 'Pick one small thing (e.g., "Open blank doc")',
      fallback: null,
      rationale: 'Start with any tiny step.',
    };
  }

  const lines = rawText
    .split(/\r?\n|[,;]/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 1) {
    return {
      action: lines[0],
      fallback: null,
      rationale: generateRationale(blocker, timeBucket, lines[0]),
    };
  }

  const candidates: Candidate[] = lines.map(line => ({
    text: line,
    score: scoreCandidate(line),
    estimatedMinutes: estimateMinutes(line),
  }));

  let filtered = candidates.filter(c => c.estimatedMinutes <= timeBucket);
  
  if (filtered.length === 0) {
    filtered = candidates;
  }

  filtered.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.text.length - b.text.length;
  });

  const primary = filtered[0];
  const fallback = filtered.length > 1 ? filtered[1].text : null;

  return {
    action: primary.text,
    fallback,
    rationale: generateRationale(blocker, timeBucket, primary.text),
  };
}
