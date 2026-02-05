const CHECKLIST_KEY = 'onebit_finalization_checklist';

export interface ChecklistData {
  logoChoice: 'text' | 'svg' | '';
  logoSvg: string;
  accentColor: string;
  demoInputs: string[];
  backgroundImage: string;
  microStepsApproved: boolean;
  dailyAnchorsApproved: boolean;
  demoVideoLink: string;
  pitchText: string;
}

let checklistData: ChecklistData = {
  logoChoice: '',
  logoSvg: '',
  accentColor: '',
  demoInputs: [],
  backgroundImage: '',
  microStepsApproved: false,
  dailyAnchorsApproved: false,
  demoVideoLink: '',
  pitchText: '',
};

export function loadChecklistData(): ChecklistData {
  try {
    const stored = localStorage.getItem(CHECKLIST_KEY);
    if (stored) {
      checklistData = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load checklist data:', e);
  }
  return checklistData;
}

export function saveChecklistData(data: Partial<ChecklistData>): void {
  checklistData = { ...checklistData, ...data };
  try {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklistData));
  } catch (e) {
    console.error('Failed to save checklist data:', e);
  }
}

export function getChecklistData(): ChecklistData {
  return checklistData;
}
