---
title: 'Moving from Bulk Crap Uninstaller'
description: 'What carries across from Bulk Crap Uninstaller to windowsweep, what does not, and the commands in order.'
tags: [compare, moving]
---

# Moving from Bulk Crap Uninstaller

**Last checked 7 November 2026.** Bulk Crap Uninstaller is open source, under Apache 2.0, and removes many programs in one batch with little input, then finds the leftovers. windowsweep's section 26 is the slower way: you pick, and each program runs its own uninstaller.

With dozens of programs to remove at once, Steam, Store and portable apps among them, and a script with no run count, Bulk Crap Uninstaller is the right tool. windowsweep fits around it: caches and logs cleared in the same tool as the uninstaller, one program at a time, with a dry-run first.

## Keep it for the batch

Section 26 uninstalls what you pick and then offers the folders each program left. Sections 23 and 27 find what older uninstalls left behind. The [sections page](../sections.md) gives the paths.

Stays with Bulk Crap Uninstaller:

- Batch removal, including Steam, Store and portable apps.
- Tracking cookies, which windowsweep never clears.

## After the batch

1. Let Bulk Crap Uninstaller do the mass removal first, as you always have.

2. Check AppData for what it missed. Section 23 offers only folders no installed program claims and nothing has touched for the `--days` window, and you choose each one:

   ```powershell
   npx windowsweep --only 23
   ```

3. Do the same in Program Files and ProgramData. Section 27 needs elevation, and chosen folders go to the Recycle Bin:

   ```powershell
   npx windowsweep --only 27 --elevate
   ```

4. Clear the caches the removed programs and the rest of the machine built up, rehearsing first with the `minimal` profile, which is sections 7 to 10:

   ```powershell
   npx windowsweep --profile minimal --dry-run --yes
   ```

   Then the same command without `--dry-run`. Deleted caches are gone for good, and programs rebuild them.

For a single program later, `npx windowsweep --only 26` runs its registered uninstaller and then offers what it left. Uninstalling is permanent.

Real runs in the [desktop app](../desktop.md) count against your plan's allowance; the command line and dry-runs are uncounted. The protected paths are listed in the [safety model](../safety-model.md).

## The price, 7 November 2026

From the project's own page that day. [Open Bulk Crap Uninstaller's site](https://www.bcuninstaller.com/) for the current release.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| Bulk Crap Uninstaller | $0 | Apache 2.0 licence, free for private and commercial use | [Source](https://www.bcuninstaller.com/), read 7 November 2026 |

windowsweep's plans and its Free plan's run limit: the [pricing page](https://windowsweep.aoneahsan.com/pricing).

## Feature by feature

| The job | Bulk Crap Uninstaller | windowsweep |
|---|---|---|
| Clears browser and app caches | Not stated on the pages we checked | Yes |
| Clears log files | Not stated on the pages we checked | Yes |
| Clears tracking cookies | Not stated on the pages we checked | No |
| Finds folders left by removed software | Yes ([source](https://www.bcuninstaller.com/)) | Yes |
| Uninstalls programs | Yes ([source](https://www.bcuninstaller.com/)) | Yes |
| Free to use | Yes ([source](https://www.bcuninstaller.com/)) | Yes |
| Open source | Yes ([source](https://www.bcuninstaller.com/)) | Yes |
| States no third-party ads or bundled offers | Not stated on the pages we checked | Yes |

Its page is about uninstalling, so four rows read "Not stated on the pages we checked". That means unmentioned, not no. The website compares them at [Bulk Crap Uninstaller and windowsweep](https://windowsweep.aoneahsan.com/compare/bulk-crap-uninstaller).
