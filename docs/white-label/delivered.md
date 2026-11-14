---
title: 'What a white-label licence delivers'
description: 'Per group: the rebranded desktop installers on your GitHub Releases with their own update key, and the engine published to npm under your name. The safety model is unchanged.'
tags: [white-label, licensing, desktop, cli]
---

# What a white-label licence delivers

## Desktop app

- The desktop window with your product name, icon and window title.
- The same two installers windowsweep ships: a setup `.exe` (NSIS) and an `.msi`.
- Published on a GitHub Releases page under your account, with an update key made for your build. Installed copies check your releases for updates, never windowsweep's.
- How sign-in, plans and run limits behave in your build is settled before the first build: switched off, or connected to a backend set up for you as [custom work](https://windowsweep.aoneahsan.com/white-label/custom-work).

The installers are not signed with a paid code-signing certificate, exactly like windowsweep's own, so SmartScreen warns on first run. A certificate in your name changes that; its cost is yours.

## Command-line tool (npm)

- The engine published to npm under your package name or scope.
- Your command name, banner and report headers.
- Run with `npx <your-package>`, the way `npx windowsweep` runs.
- Windows 10 (1809 and later) and Windows 11 only, as windowsweep is.

The published package still makes no network calls, so it carries no licence check. The engine's self-test still fails a build that adds one.

## What does not change

Your build refuses the same protected paths, keeps the same dry-run and the same declared roots. The [safety model](../safety-model.md) applies unchanged. A rebrand changes the name, icon and colours. Changing a rule is custom work, quoted and agreed before anyone writes it.
