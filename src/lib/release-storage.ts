import { defineStorage } from 'strata-storage';
import { parseStoredNotice, type StoredReleaseNotice } from './release-state.ts';

const storage = defineStorage({ namespace: 'windowsweep-docs', defaultStorages: ['localStorage'] });
const KEY = 'release-notice';

export function readReleaseNotice(): StoredReleaseNotice | null {
  try {
    return parseStoredNotice(storage.getSync<unknown>(KEY, { storage: 'localStorage' }));
  } catch {
    return null;
  }
}

export function writeReleaseNotice(notice: StoredReleaseNotice | null): void {
  try {
    if (notice) storage.setSync(KEY, notice, { storage: 'localStorage' });
    else storage.removeSync(KEY, { storage: 'localStorage' });
  } catch {
    // Storage-disabled browsers can still see an urgent block on this page.
  }
}
