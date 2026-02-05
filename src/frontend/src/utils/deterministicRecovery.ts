import { Outcome } from '../App';

interface RecoveryResult {
  message: string;
  microSteps: string[];
  options?: string[];
}

const MICRO_TEMPLATES = {
  writing: [
    'Open the file',
    'Write a title',
    'Write 1 paragraph',
    'Save draft',
  ],
  call: [
    'Find contact',
    'Write 3 bullets',
    'Call for 5 minutes',
  ],
  email: [
    'Open mailbox',
    'Draft subject',
    'Write 2 sentences',
    'Send',
  ],
  default: [
    'Set a 5-minute timer',
    'Clear desktop of distractions',
    'Do one tiny step',
  ],
};

function detectIntentVerb(task: string): keyof typeof MICRO_TEMPLATES {
  const lower = task.toLowerCase();
  
  if (/(write|draft|article|essay|blog|compose|document)/i.test(lower)) {
    return 'writing';
  }
  if (/(call|phone|ring|dial)/i.test(lower)) {
    return 'call';
  }
  if (/(email|reply|send mail|message)/i.test(lower)) {
    return 'email';
  }
  
  return 'default';
}

export function recoveryFor(outcome: Outcome, task: string): RecoveryResult {
  if (outcome === 'done') {
    return {
      message: 'Nice — you showed up.',
      microSteps: [],
      options: ['End today', 'Do another Onebit'],
    };
  }

  if (outcome === 'stuck') {
    const intent = detectIntentVerb(task);
    const steps = MICRO_TEMPLATES[intent] || MICRO_TEMPLATES.default;
    
    return {
      message: 'Try a smaller step:',
      microSteps: steps.slice(0, 2), // Exactly 2 micro-steps
    };
  }

  if (outcome === 'avoided') {
    return {
      message: 'No guilt — pick a micro-step or end the session.',
      microSteps: MICRO_TEMPLATES.default.slice(0, 2), // Exactly 2 micro-steps
    };
  }

  return {
    message: 'End session',
    microSteps: [],
    options: ['End'],
  };
}
