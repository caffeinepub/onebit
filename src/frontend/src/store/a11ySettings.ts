const A11Y_KEY = 'onebit_a11y_settings';

export interface A11ySettings {
  highContrast: boolean;
  largeFont: boolean;
}

export function loadA11ySettings(): A11ySettings {
  try {
    const stored = localStorage.getItem(A11Y_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load a11y settings:', e);
  }
  return { highContrast: false, largeFont: false };
}

export function saveA11ySettings(settings: A11ySettings): void {
  try {
    localStorage.setItem(A11Y_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save a11y settings:', e);
  }
}

export function applyA11ySettings(settings: A11ySettings): void {
  const root = document.documentElement;
  
  if (settings.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  if (settings.largeFont) {
    root.classList.add('large-font');
  } else {
    root.classList.remove('large-font');
  }
}
