---
title: 'Moving from System Ninja'
description: 'What carries across from System Ninja to windowsweep, what does not, and the commands in order.'
tags: [compare, moving]
---

# Moving from System Ninja

**Last checked 7 November 2026.** System Ninja is small and covers more than thirty browsers, cookies and history included. windowsweep leaves cookies and history alone, so this move is for the cache work and the admin sections.

## What this covers, and what stays with System Ninja

Sections 7 to 10 cover browser, desktop-app and Windows user caches and user temp. Sections 12 and 16 reach Windows Update caches and event logs when elevated, and section 16 is permanent. The [sections page](../sections.md) says what each one removes.

What windowsweep will not do for you:

- Clearing cookies and history. windowsweep does not do it.
- The process manager and the portable Pro edition.

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

Section 23 lists orphaned AppData folders and section 27 lists leftover program folders, which System Ninja's page does not state.

Read the [safety model](../safety-model.md) if you want to see what every run refuses.

## The facts, as read on 7 November 2026

System Ninja's own pages, copied as they stood that day. A price can change the day after it is read, so [open System Ninja's site](https://singularlabs.com/software/system-ninja/) before you buy.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| System Ninja Free | $0 | - | [Source](https://singularlabs.com/software/system-ninja/), read 7 November 2026 |
| SingularLabs Pro Club | $14.95 a year | Pro Club Standard, 12 months; includes System Ninja Pro | [Source](https://singularlabs.com/club/join/), read 7 November 2026 |

windowsweep's current prices and its Free plan's run limit are on the [pricing page](https://windowsweep.aoneahsan.com/pricing).

| The job | System Ninja | windowsweep |
|---|---|---|
| Clears browser and app caches | Yes ([source](https://singularlabs.com/software/system-ninja/)) | Yes |
| Clears log files | Not stated on the pages we checked | Yes |
| Clears tracking cookies | Yes ([source](https://singularlabs.com/software/system-ninja/)) | No |
| Finds folders left by removed software | Not stated on the pages we checked | Yes |
| Uninstalls programs | Yes ([source](https://singularlabs.com/software/system-ninja/)) | Yes |
| Free to use | Yes ([source](https://singularlabs.com/software/system-ninja/)) | Yes |
| Open source | Not stated on the pages we checked | Yes |
| States no ads or bundled offers | Yes ([source](https://singularlabs.com/software/system-ninja/)) | Yes |

"Not stated on the pages we checked" is not a no. The page did not say. The side-by-side version is at [System Ninja and windowsweep](https://windowsweep.aoneahsan.com/compare/system-ninja).
