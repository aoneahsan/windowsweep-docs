/**
 * Keep the docs' machine-readable facts true to this build (search audit, 2026-11-05).
 *
 * 🔴 Two defects this exists to stop, both found live with every probe passing:
 * - SA-WINDOWSWEEP-014: `llms.txt` named `desktop-v1.4.1` a release after 1.4.2 shipped, because the
 *   version was typed by hand. `static/llms.txt` now says `__TOOL_VERSION__`, and this writes the
 *   build's version into `build/llms.txt`.
 * - SA-WINDOWSWEEP-013: the shared `#software` JSON-LD node lost its `@type`. Every node must carry one,
 *   and the `#software` node's `softwareVersion` must equal this build's version.
 * The build fails, with the reason, when either is not true.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { LoadContext, Plugin } from '@docusaurus/types';

interface Options {
  version: string;
}

const PLACEHOLDER = /__TOOL_VERSION__/g;
const LD_JSON = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;

function fail(reason: string): never {
  throw new Error(`discovery-facts: ${reason}`);
}

/** Write the build's version into llms.txt and refuse a desktop tag that names another release. */
function writeLlmsTxt(outDir: string, version: string): void {
  const file = join(outDir, 'llms.txt');
  const text = readFileSync(file, 'utf8').replace(PLACEHOLDER, version);
  const tags = [...text.matchAll(/desktop-v(\d+\.\d+\.\d+)/g)].map((m) => m[1]);
  const stale = tags.filter((tag) => tag !== version);
  if (stale.length)
    fail(`llms.txt names desktop-v${stale.join(', desktop-v')}, but this build is ${version}`);
  writeFileSync(file, text);
}

/** Every JSON-LD node on the home page carries @type, and #software names this build's version. */
function checkJsonLd(outDir: string, version: string): void {
  const html = readFileSync(join(outDir, 'index.html'), 'utf8');
  const nodes = [...html.matchAll(LD_JSON)].map((m) => JSON.parse(m[1]) as Record<string, unknown>);
  if (!nodes.length) fail('the home page carries no JSON-LD');
  const untyped = nodes.filter((node) => typeof node['@type'] !== 'string');
  if (untyped.length)
    fail(
      `${untyped.length} JSON-LD node(s) without @type, e.g. ${String(untyped[0]['@id'] ?? 'no @id')}`
    );
  const software = nodes.find((node) => String(node['@id'] ?? '').endsWith('#software'));
  if (!software) fail('the #software node is missing');
  if (software.softwareVersion !== version) {
    fail(`#software says ${String(software.softwareVersion)}, but this build is ${version}`);
  }
}

export default function discoveryFacts(_context: LoadContext, options: Options): Plugin {
  return {
    name: 'windowsweep-discovery-facts',
    postBuild({ outDir }) {
      writeLlmsTxt(outDir, options.version);
      checkJsonLd(outDir, options.version);
    },
  };
}
