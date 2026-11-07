---
title: 'Moving from Bulk Crap Uninstaller'
description: 'What carries across from Bulk Crap Uninstaller to windowsweep, what does not, and the commands in order.'
tags: [compare, moving]
---

# Moving from Bulk Crap Uninstaller

**Last checked 7 November 2026.** Bulk Crap Uninstaller removes dozens of programs in one batch with little input, and it is open source too. windowsweep's section 26 is the slower way: you pick, and each program runs its own uninstaller.

## What this covers, and what stays with Bulk Crap Uninstaller

Section 26 uninstalls what you pick and then offers the folders each program left. Sections 23 and 27 find what older uninstalls left behind. The [sections page](../sections.md) says what each one removes.

What windowsweep will not do for you:

- Batch removal of Steam, Store and portable apps. If you have dozens to remove, use it for that.
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

What it adds is the rest of the disk: `npx windowsweep --dry-run --only 7,8,9,10 --yes`, then the same command without `--dry-run`.

Read the [safety model](../safety-model.md) if you want to see what every run refuses.

## The facts, as read on 7 November 2026

Bulk Crap Uninstaller's own pages, copied as they stood that day. A price can change the day after it is read, so [open Bulk Crap Uninstaller's site](https://www.bcuninstaller.com/) before you buy.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| Bulk Crap Uninstaller | $0 | Apache 2.0 licence, free for private and commercial use | [Source](https://www.bcuninstaller.com/), read 7 November 2026 |

windowsweep's current prices and its Free plan's run limit are on the [pricing page](https://windowsweep.aoneahsan.com/pricing).

| The job | Bulk Crap Uninstaller | windowsweep |
|---|---|---|
| Clears browser and app caches | Not stated on the pages we checked | Yes |
| Clears log files | Not stated on the pages we checked | Yes |
| Clears tracking cookies | Not stated on the pages we checked | No |
| Finds folders left by removed software | Yes ([source](https://www.bcuninstaller.com/)) | Yes |
| Uninstalls programs | Yes ([source](https://www.bcuninstaller.com/)) | Yes |
| Free to use | Yes ([source](https://www.bcuninstaller.com/)) | Yes |
| Open source | Yes ([source](https://www.bcuninstaller.com/)) | Yes |
| States no ads or bundled offers | Not stated on the pages we checked | Yes |

"Not stated on the pages we checked" is not a no. The page did not say. The side-by-side version is at [Bulk Crap Uninstaller and windowsweep](https://windowsweep.aoneahsan.com/compare/bulk-crap-uninstaller).
