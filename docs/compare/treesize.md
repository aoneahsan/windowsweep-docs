---
title: 'Moving from TreeSize'
description: 'How windowsweep sits beside TreeSize: one manages files by size, the other removes known caches.'
tags: [compare, moving]
---

# Moving from TreeSize

**Last checked 7 November 2026.** TreeSize is a disk space manager from JAM Software, in Free, Personal and Professional editions, and it lets you delete and act on files in bulk inside the folder view. windowsweep only touches paths it has declared, and refuses the protected ones.

These are different tools, and you may want both. TreeSize suits sorting files by size, age or type, moving or deleting them in bulk, and in the Professional edition scanning servers and network shares on a schedule. windowsweep suits a cleaner that already knows the cache, log and leftover paths, refuses the protected ones, and reports the bytes each section reclaimed.

## What changes hands

Sections 7 to 10 remove caches and temp files from declared paths. Section 19 offers large or old files from Downloads and folders you add, and they go to the Recycle Bin. See the [sections page](../sections.md) for each path.

TreeSize stays in charge of:

- Bulk moves, sorting by age or type, and in the Professional edition, server and network-share scans. windowsweep scans none of those.
- Tracking cookies are left alone by windowsweep as well.

## From hunting cache folders by hand

1. Print the list you used to build in TreeSize. This shows every path each section can reach on your machine, then the protected ones:

   ```powershell
   npx windowsweep --list-targets
   ```

2. Fence off anything you manage yourself. `--exclude-path` is refused in every section, so a tree you tidy in TreeSize stays exactly as you left it. Rehearse with it in place:

   ```powershell
   npx windowsweep --dry-run --only 7,8,9,10 --yes --exclude-path D:\Archive
   ```

3. Run the same command without `--dry-run`. A cache removed this way has no undo; its program rebuilds it.

4. For the large files TreeSize sorted for you, point section 19 at the folders you choose, then select each file:

   ```powershell
   npx windowsweep --only 19 --personal-roots "D:\Media"
   ```

The [desktop app](../desktop.md) gives the same engine a window. Real runs in it count against your plan's allowance; dry-runs and the command line do not. The [safety model](../safety-model.md) sets out every refusal.

## JAM Software's prices, 7 November 2026

Read from JAM Software's pages that day. A perpetual licence is offered beside the subscription, so [open TreeSize's site](https://www.jam-software.com/treesize) to compare them.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| TreeSize Free | $0 | For private use in a non-commercial environment | [Source](https://www.jam-software.com/treesize_free), read 7 November 2026 |
| TreeSize Personal, single licence | $25.20 a year | Subscription, annual billing; a perpetual model is also offered | [Source](https://customers.jam-software.de/prices.php?language=EN&article_no=90), read 7 November 2026 |

What windowsweep costs, Free plan run limit included, is on the [pricing page](https://windowsweep.aoneahsan.com/pricing).

## What TreeSize's pages state

They describe a disk space manager, and of the eight cleaner rows compared here they confirm only the free edition. They did not say whether TreeSize clears caches, logs or tracking cookies, finds folders left by removed software, uninstalls programs, is open source, or comes without third-party ads or bundled offers. Those rows are hidden; a page's silence is not a no.

| The job | TreeSize | windowsweep |
|---|---|---|
| Free to use | Yes ([source](https://www.jam-software.com/treesize_free)) | Yes |

Side by side on the website: [TreeSize and windowsweep](https://windowsweep.aoneahsan.com/compare/treesize).
