---
title: 'Moving from Storage Sense'
description: 'How windowsweep sits beside the Storage Sense built into Windows, and which sections cover other ground.'
tags: [compare, moving]
---

# Moving from Storage Sense

**Last checked 7 November 2026.** Storage Sense is the option in Windows Settings that deletes temporary files, empties the Recycle Bin after a time and can make cloud files online-only. Leave it on.

It needs no install and runs on its own schedule, on the system drive, and for temporary files and the Recycle Bin that may be enough. windowsweep is for the ground the Microsoft page does not name: app caches, shader caches, package-manager caches, logs and leftover folders, with a report of what each run reclaimed.

## Ground Storage Sense does not name

Sections 1, 2, 7 and 8 cover package-manager, build-tool, browser and desktop-app caches. Section 21 reports disk usage. The [sections page](../sections.md) has the full list of paths.

Storage Sense keeps its own work:

- Its schedule, and making cloud files online-only. windowsweep does not manage cloud files.
- Tracking cookies, which windowsweep never clears either.

## Running windowsweep alongside it

1. Scan. Its health report has a Storage Sense line, and the rest measures every target without removing anything:

   ```powershell
   npx windowsweep --scan
   ```

2. Rehearse the four cache sections Storage Sense leaves alone:

   ```powershell
   npx windowsweep --dry-run --only 1,2,7,8 --yes
   ```

3. Run them. Caches cannot be restored once deleted; each program rebuilds its own:

   ```powershell
   npx windowsweep --only 1,2,7,8 --yes
   ```

4. See where the rest of the space sits. Section 21 is read-only and writes its findings to a text file:

   ```powershell
   npx windowsweep --only 21
   ```

Skip section 11. It empties the Recycle Bin permanently, behind its own flag, and Storage Sense may already be doing that on a schedule.

Real runs in the [desktop app](../desktop.md) count against your plan's allowance; a dry-run or the command line never does. The [safety model](../safety-model.md) is the list of what every run refuses.

## Storage Sense's price, 7 November 2026

Read from Microsoft's support page that day. [Open Storage Sense's site](https://support.microsoft.com/en-us/windows/manage-drive-space-with-storage-sense-654f6ada-7bfc-45e5-966b-e24aded96ad5) for the setting itself.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| Built into Windows | No separate price | A Windows setting; no separate price is stated on the page | [Source](https://support.microsoft.com/en-us/windows/manage-drive-space-with-storage-sense-654f6ada-7bfc-45e5-966b-e24aded96ad5), read 7 November 2026 |

windowsweep's prices and its Free plan's run limit sit on the [pricing page](https://windowsweep.aoneahsan.com/pricing).

## What Microsoft's page states

The support page is about one setting, and of the eight rows compared in these guides it confirms only that Storage Sense costs nothing. It does not say whether it clears browser and app caches, log files or tracking cookies, finds folders left by removed software, uninstalls programs, is open source, or carries ads or bundled offers. Those rows are hidden rather than marked no.

| The job | Storage Sense | windowsweep |
|---|---|---|
| Free to use | Yes ([source](https://support.microsoft.com/en-us/windows/manage-drive-space-with-storage-sense-654f6ada-7bfc-45e5-966b-e24aded96ad5)) | Yes |

On the website: [Storage Sense and windowsweep](https://windowsweep.aoneahsan.com/compare/storage-sense).
