/**
 * Validates and normalizes LLM output to ensure it meets Onebit constraints:
 * - At most one sentence
 * - Neutral tone
 * - No greetings, motivational language, or AI self-references
 */

export function validateAndNormalizeLLMOutput(text: string): string | null {
  if (!text || typeof text !== 'string') {
    return null;
  }

  let normalized = text.trim();

  // Remove common AI greetings and self-references
  normalized = normalized.replace(/^(Hello|Hi|Hey|Greetings|As an AI|I'm an AI|I am an AI|I'm here to|I am here to)[^.!?]*[.!?]\s*/gi, '');
  normalized = normalized.replace(/^(Sure|Certainly|Of course|Absolutely|Great|Perfect)[^.!?]*[.!?]\s*/gi, '');
  
  // Remove motivational/therapy language patterns
  normalized = normalized.replace(/\b(you('ve)? got this|believe in yourself|stay positive|keep going|don't give up)\b/gi, '');
  
  // Extract first sentence only
  const sentences = normalized.split(/[.!?]+\s+/);
  if (sentences.length > 0) {
    normalized = sentences[0].trim();
  }

  // Ensure proper punctuation
  if (normalized && !normalized.match(/[.!?]$/)) {
    normalized += '.';
  }

  // Validate length (must be reasonable for a single task)
  if (normalized.length < 5 || normalized.length > 200) {
    return null;
  }

  // Check for actionable content (should contain at least one verb-like word)
  const hasAction = /\b(write|call|email|draft|finish|read|submit|book|plan|create|open|review|complete|start|send|reply|schedule|organize|prepare|update|do|make|take|set|get|find|check|work|focus)\b/i.test(normalized);
  
  if (!hasAction) {
    return null;
  }

  return normalized;
}
