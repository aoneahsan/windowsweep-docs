---
id: intro
slug: /
title: 'windowsweep - a Windows cleanup CLI that names every path first'
sidebar_label: 'windowsweep documentation'
description: 'windowsweep reclaims disk space on Windows by deleting only regenerable caches. It names every path before touching one and refuses your documents, credentials and browser state outright. Start with npx windowsweep --scan, which deletes nothing.'
tags: [windows, cleanup, cli, disk-space, overview]
---
# windowsweep

windowsweep reclaims disk space on a Windows machine by deleting only caches that rebuild themselves: package managers, build tools, browsers, editors, desktop apps, Windows temp and update leftovers, stale project artefacts. It names every path before it touches one. Your documents, credentials and browser state are refused outright, and no flag changes that.

Start with `npx windowsweep --scan`. It measures every target and deletes nothing.

The [README](https://github.com/aoneahsan/windowsweep#readme) is the short version; this site is the manual.

## What people ask before they run it

**How do I free up disk space on Windows without deleting anything important?**
windowsweep removes only regenerable caches, and refuses your documents, credentials and browser state outright. Start with `npx windowsweep --scan`, which deletes nothing and measures what is reclaimable. Then read the [safety model](./safety-model.md).

**Does this cleanup tool send my data anywhere?**
No. The command-line tool makes no network calls at all, and self-test check [9] greps its own source for HTTP and socket calls and fails the run if it finds any. The desktop application is a separate program: it sends usage and crash reports. There is no switch. In 1.1.0 no destination is configured in the build, so nothing has left the machine yet.

| The question | Where it is answered |
|---|---|
| How do I delete `node_modules` from old projects? | [Sections 0-25](./sections.md), section 17 |
| How do I clear the yarn or npm cache safely? | [Sections 0-25](./sections.md), sections 1 and 3 |
| Is it safe to use a Windows cleaner - will it delete my files? | [Safety model](./safety-model.md) |
| How do I see what it will delete before it deletes it? | [Quick start](./quick-start.md) |
| Windows Update / SoftwareDistribution is taking up space | [Admin sections and elevation](./admin-and-elevation.md) |
| How do I run a cleanup on a schedule? | [CLI reference](./cli-reference.md), `--install-task` |

## Start here

| If you want to... | Read |
|---|---|
| Install it in under a minute | [Installation](./installation.md) |
| Run your first cleanup | [Quick start](./quick-start.md) |
| Read every guarantee before deleting anything | [Safety model](./safety-model.md) |
| Know what the developer question changes | [Developer mode](./developer-mode.md) |

## Reference

| Page | What it covers |
|---|---|
| [Sections 0-25](./sections.md) | Every section: what it touches, which flags tune it, how it behaves in dry-run and batch mode |
| [CLI reference](./cli-reference.md) | Every mode, option, exit code, environment variable and config key |
| [Profiles](./profiles.md) | The named bundles: `dev`, `minimal`, `cache-only`, `system`, `deep`, `audit` |
| [Admin sections and elevation](./admin-and-elevation.md) | What needs Administrator rights, how `--elevate` works, the hibernation decision |
| [Reports and logs](./reports-and-logs.md) | What a run writes under `%USERPROFILE%\.windowsweep`, the JSON schema, exports |
| [Desktop app](./desktop.md) | The window over the same engine: what it adds, what it collects, the SmartScreen note, where it writes |
| [AI integration guide](./ai-integration-guide.md) | The contract for an agent or a script: `--json`, exit codes, guarantees |

## When something is off

| Page | What it covers |
|---|---|
| [Troubleshooting](./troubleshooting.md) | Symptom, cause, fix |
| [FAQ](./faq.mdx) | The questions people ask first |

## Meta

| Page | What it covers |
|---|---|
| [Author](./about.md) | Who built this, the sibling tools, how to support the work |
| [Packages](https://github.com/aoneahsan/windowsweep/blob/main/docs/PACKAGES.md) | The dependency and manifest record (there are no dependencies) |
| [Project status](https://github.com/aoneahsan/windowsweep/blob/main/docs/features/windowsweep-completion/00-tracker.json) | The live status record: every phase and sub-task with its state, the evidence behind it, and the rows only the author can close |

## Quick contact

| | |
|---|---|
| **Issues** | https://github.com/aoneahsan/windowsweep/issues |
| **Author** | [Ahsan Mahmood](https://aoneahsan.com) - [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |
| **Support the work** | https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep |

Last Updated: 2026-09-13 - tool version 1.2.0
