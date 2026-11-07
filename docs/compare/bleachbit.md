---
title: 'Moving from BleachBit'
description: 'What BleachBit users get from windowsweep, what stays with BleachBit, and the commands in order.'
tags: [compare, moving]
---

# Moving from BleachBit

**Last checked 7 November 2026.** BleachBit is open source and free with no run count, and it clears things windowsweep refuses to touch. Moving across fully only makes sense if you never used it for cookies or history.

## What this covers, and what stays with BleachBit

Sections 7 to 10 do the cache and temp work. Section 12 adds Windows Update and system temp, and needs an elevated run. The [sections page](../sections.md) says what each one removes.

What windowsweep will not do for you:

- Cookies, history, saved passwords and browser traces. BleachBit clears these and windowsweep leaves them alone.
- Shredding, free-space wiping, Linux, and your CleanerML rules.

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

What windowsweep adds beside it: section 23 lists orphaned AppData folders, section 27 lists folders that removed programs left, and section 26 uninstalls programs you pick. The two can sit on one machine.

Read the [safety model](../safety-model.md) if you want to see what every run refuses.

## The facts, as read on 7 November 2026

BleachBit's own pages, copied as they stood that day. A price can change the day after it is read, so [open BleachBit's site](https://www.bleachbit.org/) before you buy.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| BleachBit | $0 | The page says 100% free forever, GPLv3 | [Source](https://www.bleachbit.org/), read 7 November 2026 |

windowsweep's current prices and its Free plan's run limit are on the [pricing page](https://windowsweep.aoneahsan.com/pricing).

| The job | BleachBit | windowsweep |
|---|---|---|
| Clears browser and app caches | Yes ([source](https://www.bleachbit.org/)) | Yes |
| Clears log files | Yes ([source](https://www.bleachbit.org/)) | Yes |
| Clears tracking cookies | Yes ([source](https://www.bleachbit.org/)) | No |
| Finds folders left by removed software | Not stated on the pages we checked | Yes |
| Uninstalls programs | Not stated on the pages we checked | Yes |
| Free to use | Yes ([source](https://www.bleachbit.org/)) | Yes |
| Open source | Yes ([source](https://www.bleachbit.org/)) | Yes |
| States no ads or bundled offers | Yes ([source](https://www.bleachbit.org/)) | Yes |

"Not stated on the pages we checked" is not a no. The page did not say. The side-by-side version is at [BleachBit and windowsweep](https://windowsweep.aoneahsan.com/compare/bleachbit).
