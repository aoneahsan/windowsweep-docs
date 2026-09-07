---
id: intro
slug: /
title: 'windowsweep documentation'
description: 'Safe, developer-aware Windows cleanup CLI: what it deletes, how to preview it, and how to run it.'
tags: [windows, cleanup, cli, overview]
---
# windowsweep - Documentation

> **windowsweep** reclaims disk space on a Windows machine without putting your data at risk: package-manager
> and build caches, browser and app caches, Windows temp and update leftovers, stale project artefacts and
> more, behind one deletion chokepoint, a real dry-run and a developer mode that keeps recent work fast.

The [README](https://github.com/aoneahsan/windowsweep#readme) is the elevator pitch; this folder is the manual.

## Start here

| If you want to... | Read |
|---|---|
| Install it in under a minute | [Installation](./installation.md) |
| Run your first cleanup safely | [Quick start](./quick-start.md) |
| Understand every guarantee before deleting anything | [Safety model](./safety-model.md) |
| Know what the developer question changes | [Developer mode](./developer-mode.md) |

## Reference

| Page | What it covers |
|---|---|
| [Sections 0-25](./sections.md) | Every section: what it touches, which flags tune it, how it behaves in dry-run and batch mode |
| [CLI reference](./cli-reference.md) | Every mode, option, exit code, environment variable and config key |
| [Profiles](./profiles.md) | The named bundles: `dev`, `minimal`, `cache-only`, `system`, `deep`, `audit` |
| [Admin sections and elevation](./admin-and-elevation.md) | What needs Administrator rights, how `--elevate` works, the hibernation decision |
| [Reports and logs](./reports-and-logs.md) | What a run writes under `~\.windowsweep`, the JSON schema, exports |
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

Last Updated: 2026-09-07 - tool version 1.1.0
