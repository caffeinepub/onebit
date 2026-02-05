const DEMO_VIDEO_KEY = 'onebit_demo_video';
const PITCH_TEXT_KEY = 'onebit_pitch_text';

let demoVideoLink = '';
let pitchText = '';

export function loadAdminSettings(): void {
  try {
    demoVideoLink = localStorage.getItem(DEMO_VIDEO_KEY) || '';
    pitchText = localStorage.getItem(PITCH_TEXT_KEY) || '';
  } catch (e) {
    console.error('Failed to load admin settings:', e);
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
