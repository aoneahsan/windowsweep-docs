---
title: 'Moving from Revo Uninstaller'
description: 'What carries across from Revo Uninstaller to windowsweep, what does not, and the commands in order.'
tags: [compare, moving]
---

# Moving from Revo Uninstaller

**Last checked 7 November 2026.** Revo Uninstaller, from VS Revo Group, runs a program's own uninstaller and then scans for leftover files and registry entries. Its Pro edition adds forced uninstall and install monitoring.

If uninstalling is the whole job, Revo goes further at it than windowsweep: trace logs recorded at install time, forced removal of broken programs, and a logs database for stubborn ones. windowsweep's case is breadth. Caches, logs and leftovers come in the same tool as the uninstaller, every protected path is refused the same way, and the engine is MIT-licensed.

## Uninstalling here

Section 26 runs the uninstaller a program registered, then offers the folders it left. Section 23 lists orphaned AppData folders, and section 27 lists leftovers in Program Files and ProgramData from an elevated run. The [sections page](../sections.md) describes each.

Revo's own strengths stay with Revo:

- Forced uninstall of a broken program, install-time trace logs and the logs database. Section 26 needs a working registered uninstaller.
- Tracking cookies are outside windowsweep's reach as well.

## One program at a time

1. Find the candidates. Section 24 is read-only: it lists installed programs whose files have not been modified for a hundred days or more, largest first. Not modified is not the same as not used, so read it as a shortlist:

   ```powershell
   npx windowsweep --only 24
   ```

2. Open the uninstall section. It is interactive, and `--yes` never picks a program for you:

   ```powershell
   npx windowsweep --only 26
   ```

3. Choose. Each program runs its own uninstaller, and that is permanent. A second list offers the folders it left; the ones you tick go to the Recycle Bin.

4. Look behind older uninstalls, including ones Revo did. Add `--elevate` for section 27:

   ```powershell
   npx windowsweep --only 23,27 --elevate
   ```

Revo's page does not cover caches. Here they are a rehearsal, `npx windowsweep --dry-run --only 7,8,9,10 --yes`, followed by the same command without `--dry-run`.

The [desktop app](../desktop.md) runs the same sections. Its real runs count against your plan's allowance, while dry-runs and the command line are free of any count. For the paths no section may touch, see the [safety model](../safety-model.md).

## Revo's prices, 7 November 2026

From VS Revo Group's pages that day. [Open Revo Uninstaller's site](https://www.revouninstaller.com/products/revo-uninstaller-pro/) and check how many PCs a licence covers before buying.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| Revo Uninstaller Free | $0 | - | [Source](https://www.revouninstaller.com/products/revo-uninstaller-free/), read 7 November 2026 |
| Revo Uninstaller Pro | $24.95 a year | 1-year subscription; the page does not state how many PCs the price covers | [Source](https://www.revouninstaller.com/products/revo-uninstaller-pro/), read 7 November 2026 |
| Revo Uninstaller Pro Portable | $29.95 a year | 1-year subscription | [Source](https://www.revouninstaller.com/products/revo-uninstaller-pro/), read 7 November 2026 |

windowsweep's plans and its Free plan's run limit are on the [pricing page](https://windowsweep.aoneahsan.com/pricing).

## What Revo's pages confirm

Revo's pages, read on 7 November 2026, did not say whether it clears browser and app caches, log files or tracking cookies, is open source, or comes without ads or bundled offers. Those five rows are hidden; an unmentioned feature is not a missing one.

| The job | Revo Uninstaller | windowsweep |
|---|---|---|
| Finds folders left by removed software | Yes ([source](https://www.revouninstaller.com/products/revo-uninstaller-pro/)) | Yes |
| Uninstalls programs | Yes ([source](https://www.revouninstaller.com/products/revo-uninstaller-free/)) | Yes |
| Free to use | Yes ([source](https://www.revouninstaller.com/products/revo-uninstaller-free/)) | Yes |

Both products on one page: [Revo Uninstaller and windowsweep](https://windowsweep.aoneahsan.com/compare/revo-uninstaller).
