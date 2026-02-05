const LLM_ENABLED_KEY = 'onebit_llm_enabled';
const DEMO_VIDEO_KEY = 'onebit_demo_video';
const PITCH_TEXT_KEY = 'onebit_pitch_text';

let llmEnabled = false;
let demoVideoLink = '';
let pitchText = '';

export function loadAdminSettings(): void {
  try {
    llmEnabled = localStorage.getItem(LLM_ENABLED_KEY) === 'true';
    demoVideoLink = localStorage.getItem(DEMO_VIDEO_KEY) || '';
    pitchText = localStorage.getItem(PITCH_TEXT_KEY) || '';
  } catch (e) {
    console.error('Failed to load admin settings:', e);
  }
}

export function isLLMEnabled(): boolean {
  return llmEnabled;
}

export function enableLLM(): void {
  llmEnabled = true;
  try {
    localStorage.setItem(LLM_ENABLED_KEY, 'true');
  } catch (e) {
    console.error('Failed to save LLM setting:', e);
  }
}

export function disableLLM(): void {
  llmEnabled = false;
  try {
    localStorage.removeItem(LLM_ENABLED_KEY);
  } catch (e) {
    console.error('Failed to clear LLM setting:', e);
  }
}

export function getDemoVideoLink(): string {
  return demoVideoLink;
}

export function setDemoVideoLink(link: string): void {
  demoVideoLink = link;
  try {
    localStorage.setItem(DEMO_VIDEO_KEY, link);
  } catch (e) {
    console.error('Failed to save demo video link:', e);
  }
}

export function getPitchText(): string {
  return pitchText;
}

export function setPitchText(text: string): void {
  pitchText = text;
  try {
    localStorage.setItem(PITCH_TEXT_KEY, text);
  } catch (e) {
    console.error('Failed to save pitch text:', e);
  }
}
