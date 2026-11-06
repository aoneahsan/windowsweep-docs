/**
 * The release-notes signup's transport and its one device-local memory (owner decision D88; words in
 * windowsweep/docs/story/drafts/emails-1.4.0.md, "Release newsletter signup — website and docs").
 *
 * 🔴 FilesHub's `subscribe` answers 202 for every address, known or not, and the person joins only after
 * confirming on FilesHub's page (double opt-in). So "already on the list" can only mean "this browser sent this
 * address before", and its words never confirm membership. The key is a public, origin-restricted key that can
 * do nothing but subscribe (FilesHub key 92).
 */
import { defineStorage } from 'strata-storage';

const storage = defineStorage({ namespace: 'windowsweep-docs', defaultStorages: ['localStorage'] });
const KEY = 'newsletter-sent';
const LOCAL = { storage: 'localStorage' as const };

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

function sentList(): string[] {
  try {
    const value = storage.getSync<unknown>(KEY, LOCAL);
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

/** Whether this browser already sent this address to the list. */
export function wasSent(address: string): boolean {
  return sentList().includes(normalizeEmail(address));
}

export function rememberSent(address: string): void {
  const list = sentList();
  const value = normalizeEmail(address);
  if (list.includes(value)) return;
  try {
    storage.setSync(KEY, [...list, value].slice(-20), LOCAL);
  } catch {
    /* blocked storage: the next send simply shows "Check your inbox" again */
  }
}

/** POST the address; true when FilesHub accepted the request (it answers 202 whether or not the address is new). */
export async function subscribe(
  listId: string,
  key: string,
  address: string,
  turnstileToken: string | null
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://fileshub.zaions.com/api/v1/email-lists/${encodeURIComponent(listId)}/subscribe`,
      {
        method: 'POST',
        headers: {
          'X-API-Key': key,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(
          turnstileToken
            ? { email: normalizeEmail(address), turnstile_token: turnstileToken }
            : { email: normalizeEmail(address) }
        ),
      }
    );
    return response.status >= 200 && response.status < 300;
  } catch {
    return false;
  }
}
