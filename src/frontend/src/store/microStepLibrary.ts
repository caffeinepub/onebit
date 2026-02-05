const MICRO_STEP_KEY = 'onebit_micro_steps';

export interface MicroStepCategory {
  name: string;
  steps: string[];
}

const DEFAULT_LIBRARY: MicroStepCategory[] = [
  {
    name: 'Writing',
    steps: [
      'Open the file',
      'Write a title',
      'Write one sentence',
      'Set a 5-minute timer',
    ],
  },
  {
    name: 'Studying',
    steps: [
      'Open the textbook',
      'Read one paragraph',
      'Write one question',
      'Highlight one key point',
    ],
  },
  {
    name: 'Calls',
    steps: [
      'Find contact info',
      'Write 3 bullet points',
      'Set a reminder',
      'Draft opening line',
    ],
  },
  {
    name: 'Admin',
    steps: [
      'Open the form',
      'Fill one field',
      'Find the document',
      'Write the subject line',
    ],
  },
  {
    name: 'Generic',
    steps: [
      'Set a 5-minute timer',
      'Clear desktop of distractions',
      'Write down the first step',
      'Open the relevant app',
    ],
  },
];

let library: MicroStepCategory[] = [];

export function loadMicroStepLibrary(): void {
  try {
    const stored = localStorage.getItem(MICRO_STEP_KEY);
    if (stored) {
      library = JSON.parse(stored);
    } else {
      library = JSON.parse(JSON.stringify(DEFAULT_LIBRARY));
    }
  } catch (e) {
    console.error('Failed to load micro-step library:', e);
    library = JSON.parse(JSON.stringify(DEFAULT_LIBRARY));
  }
}

export function getMicroStepLibrary(): MicroStepCategory[] {
  if (library.length === 0) {
    loadMicroStepLibrary();
  }
  return library;
}

export function setMicroStepLibrary(newLibrary: MicroStepCategory[]): void {
  library = newLibrary;
  try {
    localStorage.setItem(MICRO_STEP_KEY, JSON.stringify(library));
  } catch (e) {
    console.error('Failed to save micro-step library:', e);
  }
}
