# Contributing to windowsweep-docs

Thanks for your interest. This repository is the Docusaurus site behind
**https://windowsweep-docs.aoneahsan.com**; the tool it documents lives at
[aoneahsan/windowsweep](https://github.com/aoneahsan/windowsweep).

## Where a change belongs

| Change | Where |
|---|---|
| A factual error, a wrong flag, a missing section | The **CLI repo's `docs/`** first. This site mirrors it |
| A broken link, a navigation or sidebar problem, styling, front matter | Here |
| A bug in the tool, or a feature request | [windowsweep issues](https://github.com/aoneahsan/windowsweep/issues) |

## Ground rules

- 🔴 **This repository is public. Never commit a secret.** Only `.env.example`, with placeholders. Every
  analytics key is optional; an absent key skips that provider, so the build never needs one.
- **Never imply a deletion is reversible.** windowsweep has no undo for caches. Say what is permanent.
- Every page carries `title` and `description` front matter, and appears in `sidebars.ts` in the same change.
- Links between pages are relative; links to files that only exist in the CLI repo are absolute.
- GitHub Pages is the only deploy path. No Firebase files.

## Setup

```bash
git clone https://github.com/aoneahsan/windowsweep-docs.git
cd windowsweep-docs
yarn install
yarn start
```

## Before opening a pull request

```bash
yarn build      # this IS the link checker: onBrokenLinks and onBrokenAnchors are 'throw'
yarn typecheck
```

Both must be clean. `main` is protected: changes land through a reviewed pull request.
