const DEMO_MODE_KEY = 'onebit_demo_mode';

let demoModeEnabled = false;

export function loadDemoMode(): boolean {
  try {
    const stored = localStorage.getItem(DEMO_MODE_KEY);
    demoModeEnabled = stored === 'true';
    return demoModeEnabled;
  } catch {
    return false;
  }
}

export function isDemoMode(): boolean {
  return demoModeEnabled;
}

export function enableDemoMode(): void {
  demoModeEnabled = true;
  try {
    localStorage.setItem(DEMO_MODE_KEY, 'true');
  } catch (e) {
    console.error('Failed to save demo mode setting:', e);
  }
}

export function disableDemoMode(): void {
  demoModeEnabled = false;
  try {
    localStorage.removeItem(DEMO_MODE_KEY);
  } catch (e) {
    console.error('Failed to clear demo mode setting:', e);
  }
}
