import { Outcome } from '../App';
import { getMicroStepLibrary, MicroStepCategory } from '../store/microStepLibrary';

interface RecoveryResult {
  message: string;
  microSteps: string[];
  options?: string[];
}

function detectCategory(task: string): string {
  const lower = task.toLowerCase();
  
  if (/(write|draft|article|essay|blog|compose|document|paper)/i.test(lower)) {
    return 'Writing';
  }
  if (/(study|learn|read|review|memorize|practice|homework)/i.test(lower)) {
    return 'Studying';
  }
  if (/(call|phone|ring|dial|talk|speak|contact)/i.test(lower)) {
    return 'Calls';
  }
  if (/(form|admin|paperwork|file|submit|application|register)/i.test(lower)) {
    return 'Admin';
  }
  
  return 'Generic';
}

function selectTwoSteps(category: string, task: string): string[] {
  const library = getMicroStepLibrary();
  const cat = library.find(c => c.name === category);
  
  if (!cat || cat.steps.length === 0) {
    const generic = library.find(c => c.name === 'Generic');
    if (generic && generic.steps.length >= 2) {
      return generic.steps.slice(0, 2);
    }
    return ['Set a 5-minute timer', 'Clear desktop of distractions'];
  }
  
  const taskHash = task.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const startIndex = taskHash % Math.max(1, cat.steps.length - 1);
  
  const step1 = cat.steps[startIndex];
  const step2 = cat.steps[(startIndex + 1) % cat.steps.length];
  
  return [step1, step2];
}

export function recoveryFor(outcome: Outcome, task: string): RecoveryResult {
  if (outcome === 'done') {
    return {
      message: 'Nice — you showed up.',
      microSteps: [],
      options: ['Start new Onebit', 'End session'],
    };
  }

  if (outcome === 'stuck') {
    const category = detectCategory(task);
    const steps = selectTwoSteps(category, task);
    
    return {
      message: 'Try a smaller step:',
      microSteps: steps,
    };
  }

  if (outcome === 'avoided') {
    const category = detectCategory(task);
    const steps = selectTwoSteps(category, task);
    
    return {
      message: 'No guilt — pick a micro-step or end the session.',
      microSteps: steps,
    };
  }

  return {
    message: 'End session',
    microSteps: [],
    options: ['End'],
  };
}
