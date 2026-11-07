---
title: 'Moving from Revo Uninstaller'
description: 'What carries across from Revo Uninstaller to windowsweep, what does not, and the commands in order.'
tags: [compare, moving]
---

# Moving from Revo Uninstaller

**Last checked 7 November 2026.** Revo Uninstaller is built around uninstalling, and its Pro edition goes further at that one job than windowsweep does. windowsweep's reason to exist beside it is the caches and logs in the same tool.

## What this covers, and what stays with Revo Uninstaller

Section 26 runs the uninstaller a program registered, then offers the folders it left. Section 23 lists orphaned AppData folders, and section 27 lists leftovers in Program Files and ProgramData, elevated. The [sections page](../sections.md) says what each one removes.

What windowsweep will not do for you:

- Forced uninstall of a broken program, install-time trace logs and Revo's logs database. windowsweep has none of them, and section 26 needs a working registered uninstaller.
- Tracking cookies stay untouched by windowsweep.

## The move, step by step

1. Look first. This deletes nothing:

   ```powershell
   npx windowsweep --scan
   ```

2. Open the uninstall section. It is interactive, so `--yes` never picks for you:

   ```powershell
   npx windowsweep --only 26
   ```

3. Pick from the list. Each program runs its own uninstaller, and uninstalling is permanent. A second list then offers the folders it left, and those go to the Recycle Bin.

4. Look for older leftovers. Add `--elevate` when you reach section 27:

   ```powershell
   npx windowsweep --only 23,27 --elevate
   ```

Then the part Revo's page does not cover: `npx windowsweep --dry-run --only 7,8,9,10 --yes`, and the same command without `--dry-run`.

Read the [safety model](../safety-model.md) if you want to see what every run refuses.

## The facts, as read on 7 November 2026

Revo Uninstaller's own pages, copied as they stood that day. A price can change the day after it is read, so [open Revo Uninstaller's site](https://www.revouninstaller.com/products/revo-uninstaller-pro/) before you buy.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| Revo Uninstaller Free | $0 | - | [Source](https://www.revouninstaller.com/products/revo-uninstaller-free/), read 7 November 2026 |
| Revo Uninstaller Pro | $24.95 a year | 1-year subscription; the page does not state how many PCs the price covers | [Source](https://www.revouninstaller.com/products/revo-uninstaller-pro/), read 7 November 2026 |
| Revo Uninstaller Pro Portable | $29.95 a year | 1-year subscription | [Source](https://www.revouninstaller.com/products/revo-uninstaller-pro/), read 7 November 2026 |

windowsweep's current prices and its Free plan's run limit are on the [pricing page](https://windowsweep.aoneahsan.com/pricing).

| The job | Revo Uninstaller | windowsweep |
|---|---|---|
| Clears browser and app caches | Not stated on the pages we checked | Yes |
| Clears log files | Not stated on the pages we checked | Yes |
| Clears tracking cookies | Not stated on the pages we checked | No |
| Finds folders left by removed software | Yes ([source](https://www.revouninstaller.com/products/revo-uninstaller-pro/)) | Yes |
| Uninstalls programs | Yes ([source](https://www.revouninstaller.com/products/revo-uninstaller-free/)) | Yes |
| Free to use | Yes ([source](https://www.revouninstaller.com/products/revo-uninstaller-free/)) | Yes |
| Open source | Not stated on the pages we checked | Yes |
| States no ads or bundled offers | Not stated on the pages we checked | Yes |

"Not stated on the pages we checked" is not a no. The page did not say. The side-by-side version is at [Revo Uninstaller and windowsweep](https://windowsweep.aoneahsan.com/compare/revo-uninstaller).
