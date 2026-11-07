---
title: 'Moving from TreeSize'
description: 'How windowsweep sits beside TreeSize: one manages files by size, the other removes known caches.'
tags: [compare, moving]
---

# Moving from TreeSize

**Last checked 7 November 2026.** TreeSize lets you sort, move and delete anything you can see. windowsweep only touches paths it has declared, and it refuses the protected ones. These are different tools, and you may want both.

## What this covers, and what stays with TreeSize

Sections 7 to 10 remove caches and temp files from declared paths. Section 19 offers large or old files from Downloads and folders you add, and they go to the Recycle Bin. The [sections page](../sections.md) says what each one removes.

What windowsweep will not do for you:

- Bulk moves, sorting by age or type, and in the Professional edition, server and network-share scans. windowsweep scans none of those.
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

If you used TreeSize to find cache folders by hand, `windowsweep --list-targets` prints every path each section can reach on your machine.

Read the [safety model](../safety-model.md) if you want to see what every run refuses.

## The facts, as read on 7 November 2026

TreeSize's own pages, copied as they stood that day. A price can change the day after it is read, so [open TreeSize's site](https://www.jam-software.com/treesize) before you buy.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| TreeSize Free | $0 | For private use in a non-commercial environment | [Source](https://www.jam-software.com/treesize_free), read 7 November 2026 |
| TreeSize Personal, single licence | $25.20 a year | Subscription, annual billing; a perpetual model is also offered | [Source](https://customers.jam-software.de/prices.php?language=EN&article_no=90), read 7 November 2026 |

windowsweep's current prices and its Free plan's run limit are on the [pricing page](https://windowsweep.aoneahsan.com/pricing).

| The job | TreeSize | windowsweep |
|---|---|---|
| Clears browser and app caches | Not stated on the pages we checked | Yes |
| Clears log files | Not stated on the pages we checked | Yes |
| Clears tracking cookies | Not stated on the pages we checked | No |
| Finds folders left by removed software | Not stated on the pages we checked | Yes |
| Uninstalls programs | Not stated on the pages we checked | Yes |
| Free to use | Yes ([source](https://www.jam-software.com/treesize_free)) | Yes |
| Open source | Not stated on the pages we checked | Yes |
| States no ads or bundled offers | Not stated on the pages we checked | Yes |

"Not stated on the pages we checked" is not a no. The page did not say. The side-by-side version is at [TreeSize and windowsweep](https://windowsweep.aoneahsan.com/compare/treesize).
