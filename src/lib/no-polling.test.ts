/**
 * No polling (fleet law 2026-11-03, `aoneahsan-cccs-realtime-not-polling`): the docs site has
 * no ESLint, so this ratchet is its gate. Live data is pushed (the release gate listens on
 * Realtime and re-reads on rejoin, focus and `online`); a timer may only ask for no data,
 * and then it says so on the line:
 * `// polling-exception: <kind> — <reason>`.
 *
 * It reads the source as text: a `setInterval(` call, or a `refetchInterval` /
 * `refreshInterval` / `pollInterval` option, fails unless its line or the line above
 * carries that marker.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = /\.(ts|tsx|js|jsx|mjs)$/;
const POLL = /\bsetInterval\s*\(|\b(refetchInterval|refreshInterval|pollInterval)\s*:/;
const MARKER = 'polling-exception:';

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return SOURCE.test(name) && !/\.test\./.test(name) ? [path] : [];
  });
}

test('no timer asks for data anywhere in src/', () => {
  const found: string[] = [];
  for (const file of files(src)) {
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      if (!POLL.test(line)) return;
      if (line.includes(MARKER) || (lines[i - 1] ?? '').includes(MARKER)) return;
      found.push(`${file}:${String(i + 1)}: ${line.trim()}`);
    });
  }
  assert.deepEqual(found, [], `unmarked polling - push the change instead:\n${found.join('\n')}`);
});
