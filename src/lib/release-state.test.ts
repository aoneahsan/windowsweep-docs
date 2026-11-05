import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compareSemver,
  decideRelease,
  parseReleaseRecord,
  parseStoredNotice,
  type ReleaseRecord,
  type StoredReleaseNotice,
} from './release-state.ts';

const normal: ReleaseRecord = {
  version: '1.4.2',
  severity: 'normal',
  reason: 'The docs update check was fixed.',
  minNativeVersion: null,
};
const stored: StoredReleaseNotice = {
  version: normal.version,
  reason: normal.reason,
  runId: 'earlier',
  storedAt: '2026-11-03T08:00:00.000Z',
  dismissed: true,
};

test('numeric semver and malformed release rows', () => {
  assert.equal(compareSemver('1.10.0', '1.9.8'), 1);
  assert.equal(compareSemver('1.4.1', '1.4.1'), 0);
  assert.equal(compareSemver('1.4.1-beta', '1.4.1'), null);
  assert.equal(parseReleaseRecord({ version: '1.4.2', severity: 'urgent', reason: '' }), null);
  assert.equal(parseStoredNotice({ ...stored, version: '1.4.2-beta' }), null);
});

test('no row fails open and a current build clears the gate', () => {
  assert.deepEqual(decideRelease({ running: '1.4.1', record: null, stored: null, runId: 'now' }), {
    kind: 'none',
  });
  assert.deepEqual(decideRelease({ running: '1.4.2', record: normal, stored, runId: 'now' }), {
    kind: 'none',
  });
});

test('normal releases warn this start and block next start even offline', () => {
  assert.equal(
    decideRelease({ running: '1.4.1', record: normal, stored: null, runId: 'now' }).kind,
    'notice'
  );
  assert.equal(
    decideRelease({ running: '1.4.1', record: normal, stored, runId: 'now' }).kind,
    'block'
  );
  assert.equal(
    decideRelease({ running: '1.4.1', record: null, stored, runId: 'now' }).kind,
    'block'
  );
});

test('a new normal version warns before its next-start block', () => {
  const oldStored = { ...stored, version: '1.4.0' };
  assert.equal(
    decideRelease({ running: '1.3.2', record: normal, stored: oldStored, runId: 'now' }).kind,
    'notice'
  );
});

test('the newest row corrects a stored notice: a mistake is fixed by a newer row', () => {
  // Proved on the test channel 2026-11-05: 1.4.2 published, then 1.4.1. A row at or below this
  // build clears the stored notice; one still above it is announced as its own release.
  const higherStored = { ...stored, version: '1.4.3', reason: 'Mistaken release.' };
  assert.deepEqual(
    decideRelease({ running: '1.4.2', record: normal, stored: higherStored, runId: 'now' }),
    { kind: 'none' }
  );
  const corrected = decideRelease({
    running: '1.4.1',
    record: normal,
    stored: higherStored,
    runId: 'now',
  });
  assert.ok(corrected.kind === 'notice');
  assert.equal(corrected.release.version, '1.4.2');
});

test('urgent release blocks immediately with the published reason', () => {
  const urgent: ReleaseRecord = { ...normal, severity: 'urgent' };
  assert.deepEqual(
    decideRelease({ running: '1.4.1', record: urgent, stored: null, runId: 'now' }),
    {
      kind: 'block',
      release: urgent,
      fromEarlierStart: false,
    }
  );
});
