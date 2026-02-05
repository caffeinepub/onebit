const SYNC_ENABLED_KEY = 'onebit_sync_enabled';

let syncEnabled = false;

export function loadSyncSettings(): boolean {
  try {
    const stored = localStorage.getItem(SYNC_ENABLED_KEY);
    syncEnabled = stored === 'true';
    return syncEnabled;
  } catch {
    return false;
  }
}

export function isSyncEnabled(): boolean {
  return syncEnabled;
}

export function enableSync(): void {
  syncEnabled = true;
  try {
    localStorage.setItem(SYNC_ENABLED_KEY, 'true');
  } catch (e) {
    console.error('Failed to save sync setting:', e);
  }
}

export function disableSync(): void {
  syncEnabled = false;
  try {
    localStorage.removeItem(SYNC_ENABLED_KEY);
  } catch (e) {
    console.error('Failed to clear sync setting:', e);
  }
}
