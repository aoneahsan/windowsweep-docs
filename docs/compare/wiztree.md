---
title: 'Moving from WizTree'
description: 'How windowsweep sits beside WizTree: one shows where the space went, the other removes known caches.'
tags: [compare, moving]
---

# Moving from WizTree

**Last checked 7 November 2026.** WizTree, from Antibody Software, reads the NTFS master file table and shows the largest files and folders in seconds. It answers where the space went. windowsweep does a different job, so there is nothing to move away from.

When the question is where the space went, WizTree is the tool: a tree map of every file, duplicate finding and CSV export. windowsweep is for the next step, removing the caches, logs and leftovers as well as measuring them, with each target named before it is touched. Keep WizTree, and use it to check what windowsweep did.

## Where the two meet

Sections 7 to 10 remove the caches and temp files that may sit near the top of WizTree's list. Section 21 is a plain disk usage report, and section 19 offers large or old personal files for you to pick from, one by one. The [sections page](../sections.md) has the detail.

WizTree's job stays WizTree's:

- The tree map, duplicate finding and CSV export.
- Tracking cookies are not touched by windowsweep at all.

## Before and after, measured by WizTree

1. Run WizTree and note the size of your profile folder and `AppData\Local`.

2. Get windowsweep's own view of the same folders. Section 21 is read-only, lists the 20 largest entries in each, and marks the protected ones:

   ```powershell
   npx windowsweep --only 21
   ```

3. Rehearse the cache sections. The output names every path that would go:

   ```powershell
   npx windowsweep --dry-run --only 7,8,9,10 --yes
   ```

4. Run them. A deleted cache cannot be undone; the program it belongs to rebuilds it:

   ```powershell
   npx windowsweep --only 7,8,9,10 --yes
   ```

5. Run WizTree again. The difference is what the run reclaimed, measured by something other than windowsweep.

Large files WizTree showed you in Downloads are section 19's territory: `npx windowsweep --only 19` offers them, you select each one, and selected files go to the Recycle Bin.

The [desktop app](../desktop.md) runs the same sections; its real runs count against your plan's allowance, its dry-runs do not, and the command line is never counted. The [safety model](../safety-model.md) lists the folders no run may enter.

## WizTree's prices, 7 November 2026

As Antibody Software's pages put them that day. [Open WizTree's site](https://diskanalyzer.com/) to check the licence terms that apply to you.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| WizTree (personal use) | $0 | The page says free for personal use | [Source](https://diskanalyzer.com/), read 7 November 2026 |
| Supporter code, Individual | $25 once | Supporter codes do not expire; free upgrades for one year | [Source](https://diskanalyzer.com/donate), read 7 November 2026 |

windowsweep's prices and the Free plan's run limit are on its [pricing page](https://windowsweep.aoneahsan.com/pricing).

## What WizTree's page states

WizTree's page is about analysing disk space. Of the eight cleaner jobs in these guides, it states one: free for personal use. Whether it clears caches, logs or tracking cookies, finds folders left by removed software, uninstalls programs, is open source or carries ads goes unsaid, so those rows are hidden. Not mentioned is not the same as no.

| The job | WizTree | windowsweep |
|---|---|---|
| Free to use | Yes ([source](https://diskanalyzer.com/)) | Yes |

The website version: [WizTree and windowsweep](https://windowsweep.aoneahsan.com/compare/wiztree).
