import test from 'node:test';
import assert from 'node:assert/strict';
import { compareSemver, decideRelease, parseReleaseRecord, parseStoredNotice } from './release-state.ts';

const normal = {
  version: '1.4.2', severity: 'normal', reason: 'The docs update check was fixed.', minNativeVersion: null,
};
const stored = {
  version: normal.version, reason: normal.reason, runId: 'earlier',
  storedAt: '2026-11-03T08:00:00.000Z', dismissed: true,
};

test('numeric semver and malformed release rows', () => {
  assert.equal(compareSemver('1.10.0', '1.9.8'), 1);
  assert.equal(compareSemver('1.4.1', '1.4.1'), 0);
  assert.equal(compareSemver('1.4.1-beta', '1.4.1'), null);
  assert.equal(parseReleaseRecord({ version: '1.4.2', severity: 'urgent', reason: '' }), null);
  assert.equal(parseStoredNotice({ ...stored, version: '1.4.2-beta' }), null);
});

test('no row fails open and a current build clears the gate', () => {
  assert.deepEqual(decideRelease({ running: '1.4.1', record: null, stored: null, runId: 'now' }), { kind: 'none' });
  assert.deepEqual(decideRelease({ running: '1.4.2', record: normal, stored, runId: 'now' }), { kind: 'none' });
});

test('normal releases warn this start and block next start even offline', () => {
  assert.equal(decideRelease({ running: '1.4.1', record: normal, stored: null, runId: 'now' }).kind, 'notice');
  assert.equal(decideRelease({ running: '1.4.1', record: normal, stored, runId: 'now' }).kind, 'block');
  assert.equal(decideRelease({ running: '1.4.1', record: null, stored, runId: 'now' }).kind, 'block');
});

test('a new normal version warns before its next-start block', () => {
  const oldStored = { ...stored, version: '1.4.0' };
  assert.equal(decideRelease({ running: '1.3.2', record: normal, stored: oldStored, runId: 'now' }).kind, 'notice');
});

test('a stale view row never weakens a newer stored notice', () => {
  const newerStored = { ...stored, version: '1.4.3', reason: 'Later release.' };
  const olderView = { ...normal, version: '1.4.2' };
  const decision = decideRelease({ running: '1.4.1', record: olderView, stored: newerStored, runId: 'now' });
  assert.equal(decision.kind, 'block');
  assert.equal(decision.release.version, '1.4.3');
  assert.equal(decision.release.reason, 'Later release.');
});

test('urgent release blocks immediately with the published reason', () => {
  const urgent = { ...normal, severity: 'urgent' };
  assert.deepEqual(decideRelease({ running: '1.4.1', record: urgent, stored: null, runId: 'now' }), {
    kind: 'block', release: urgent, fromEarlierStart: false,
  });
});
