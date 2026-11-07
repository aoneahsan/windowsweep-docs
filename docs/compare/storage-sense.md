---
title: 'Moving from Storage Sense'
description: 'How windowsweep sits beside the Storage Sense built into Windows, and which sections cover other ground.'
tags: [compare, moving]
---

# Moving from Storage Sense

**Last checked 7 November 2026.** Storage Sense is part of Windows, costs no install and runs on its own. Leave it on. Nothing here asks you to turn it off, and for temporary files and the Recycle Bin it may be enough.

## What this covers, and what stays with Storage Sense

Sections 1, 2, 7 and 8 cover package-manager, build-tool, browser and desktop-app caches, none of which the Microsoft page names. Section 21 reports disk usage, and every run reports what it reclaimed. The [sections page](../sections.md) says what each one removes.

What windowsweep will not do for you:

- Storage Sense itself: its schedule, and making cloud files online-only. windowsweep does not manage cloud files.
- Tracking cookies stay untouched by windowsweep.

## The move, step by step

1. Look first. This deletes nothing:

   ```powershell
   npx windowsweep --scan
   ```

2. Rehearse the sections that do this job. Each line says what it would remove, and nothing goes:

   ```powershell
   npx windowsweep --dry-run --only 1,2,7,8 --yes
   ```

3. Run them. There is no undo for a cache it deletes, though the program rebuilds it:

   ```powershell
   npx windowsweep --only 1,2,7,8 --yes
   ```

4. Prefer a window? The [desktop app](../desktop.md) drives the same engine. A real run there counts against your plan's allowance. A dry-run and the command line never do.

Section 11, the Recycle Bin, is permanent and sits behind its own flag. If Storage Sense already empties the bin on a schedule, you can leave section 11 alone.

Read the [safety model](../safety-model.md) if you want to see what every run refuses.

## The facts, as read on 7 November 2026

Storage Sense's own pages, copied as they stood that day. A price can change the day after it is read, so [open Storage Sense's site](https://support.microsoft.com/en-us/windows/manage-drive-space-with-storage-sense-654f6ada-7bfc-45e5-966b-e24aded96ad5) before you buy.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| Built into Windows | No separate price | A Windows setting; no separate price is stated on the page | [Source](https://support.microsoft.com/en-us/windows/manage-drive-space-with-storage-sense-654f6ada-7bfc-45e5-966b-e24aded96ad5), read 7 November 2026 |

windowsweep's current prices and its Free plan's run limit are on the [pricing page](https://windowsweep.aoneahsan.com/pricing).

| The job | Storage Sense | windowsweep |
|---|---|---|
| Clears browser and app caches | Not stated on the pages we checked | Yes |
| Clears log files | Not stated on the pages we checked | Yes |
| Clears tracking cookies | Not stated on the pages we checked | No |
| Finds folders left by removed software | Not stated on the pages we checked | Yes |
| Uninstalls programs | Not stated on the pages we checked | Yes |
| Free to use | Yes ([source](https://support.microsoft.com/en-us/windows/manage-drive-space-with-storage-sense-654f6ada-7bfc-45e5-966b-e24aded96ad5)) | Yes |
| Open source | Not stated on the pages we checked | Yes |
| States no ads or bundled offers | Not stated on the pages we checked | Yes |

"Not stated on the pages we checked" is not a no. The page did not say. The side-by-side version is at [Storage Sense and windowsweep](https://windowsweep.aoneahsan.com/compare/storage-sense).
