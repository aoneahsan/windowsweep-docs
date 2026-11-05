/**
 * Stamp the docs service worker with this build, so an open tab takes the next deploy (update flow, layer 1).
 *
 * 🔴 An open tab only takes a new build when `registration.update()` finds CHANGED BYTES at `/sw.js`.
 * The worker's code never changes between builds, so `static/sw.js` carried `const BUILD` to be bumped by
 * hand for every published build - and the 2026-11-04 and 2026-11-05 redeploys left it at 1.4.1, so no tab
 * left open took them (found 2026-11-05). After every build this writes the main bundle's name into it,
 * and the build fails if it cannot.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from '@docusaurus/types';

const MARK = /const BUILD = '[^']*';/;

export default function workerFingerprint(): Plugin {
  return {
    name: 'windowsweep-worker-fingerprint',
    postBuild({ outDir }) {
      const main = readdirSync(join(outDir, 'assets', 'js')).find((name) =>
        /^main\.[0-9a-f]+\.js$/.test(name)
      );
      const file = join(outDir, 'sw.js');
      const source = readFileSync(file, 'utf8');
      if (!main || !MARK.test(source)) {
        throw new Error(
          'worker-fingerprint: no main bundle or no BUILD line in sw.js, so open tabs would never take this deploy'
        );
      }
      writeFileSync(file, source.replace(MARK, `const BUILD = '${main}';`));
      if (!readFileSync(file, 'utf8').includes(`const BUILD = '${main}';`)) {
        throw new Error('worker-fingerprint: the stamp did not land in sw.js');
      }
    },
  };
}
