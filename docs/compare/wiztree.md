---
title: 'Moving from WizTree'
description: 'How windowsweep sits beside WizTree: one shows where the space went, the other removes known caches.'
tags: [compare, moving]
---

# Moving from WizTree

**Last checked 7 November 2026.** WizTree answers where the space went, and it answers fast. windowsweep does a different job, so there is nothing to move away from. Keep WizTree and use it to see what windowsweep did.

## What this covers, and what stays with WizTree

Sections 7 to 10 remove the caches and temp files WizTree may show you at the top of its list. Section 21 is a plain disk usage report, and section 19 offers large or old personal files for you to pick from, one by one. The [sections page](../sections.md) says what each one removes.

What windowsweep will not do for you:

- The tree map, duplicate finding and CSV export. windowsweep has none of them.
- Tracking cookies stay untouched by windowsweep.

## The move, step by step

1. Look first. This deletes nothing:

   ```powershell
   npx windowsweep --scan
   ```

2. Rehearse the sections that do this job. Each line says what it would remove, and nothing goes:

   ```powershell
   npx windowsweep --dry-run --only 7,8,9,10 --yes
   ```

3. Run them. There is no undo for a cache it deletes, though the program rebuilds it:

   ```powershell
   npx windowsweep --only 7,8,9,10 --yes
   ```

4. Prefer a window? The [desktop app](../desktop.md) drives the same engine. A real run there counts against your plan's allowance. A dry-run and the command line never do.

A useful order: run WizTree, run windowsweep, then run WizTree again. The difference is what the run reclaimed, measured by something else.

Read the [safety model](../safety-model.md) if you want to see what every run refuses.

## The facts, as read on 7 November 2026

WizTree's own pages, copied as they stood that day. A price can change the day after it is read, so [open WizTree's site](https://diskanalyzer.com/) before you buy.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| WizTree (personal use) | $0 | The page says free for personal use | [Source](https://diskanalyzer.com/), read 7 November 2026 |
| Supporter code, Individual | $25 once | Supporter codes do not expire; free upgrades for one year | [Source](https://diskanalyzer.com/donate), read 7 November 2026 |

windowsweep's current prices and its Free plan's run limit are on the [pricing page](https://windowsweep.aoneahsan.com/pricing).

| The job | WizTree | windowsweep |
|---|---|---|
| Clears browser and app caches | Not stated on the pages we checked | Yes |
| Clears log files | Not stated on the pages we checked | Yes |
| Clears tracking cookies | Not stated on the pages we checked | No |
| Finds folders left by removed software | Not stated on the pages we checked | Yes |
| Uninstalls programs | Not stated on the pages we checked | Yes |
| Free to use | Yes ([source](https://diskanalyzer.com/)) | Yes |
| Open source | Not stated on the pages we checked | Yes |
| States no ads or bundled offers | Not stated on the pages we checked | Yes |

"Not stated on the pages we checked" is not a no. The page did not say. The side-by-side version is at [WizTree and windowsweep](https://windowsweep.aoneahsan.com/compare/wiztree).
