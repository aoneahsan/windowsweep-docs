---
title: 'Moving from Microsoft PC Manager'
description: 'How windowsweep sits beside Microsoft PC Manager, and the commands that cover what it does not name.'
tags: [compare, moving]
---

# Moving from Microsoft PC Manager

**Last checked 7 November 2026.** Microsoft PC Manager comes from the people who make Windows, and it may well be all you need. If you want every path named before it goes, or developer caches covered, windowsweep can run beside it. Neither has to go.

## What this covers, and what stays with Microsoft PC Manager

Sections 1, 2 and 8 cover package-manager, build-tool and desktop-app caches. Sections 23 and 27 list folders removed programs left behind. The [sections page](../sections.md) says what each one removes.

What windowsweep will not do for you:

- PC Manager's boost button, health check and pop-up management. windowsweep has no equivalent.
- Tracking cookies stay untouched by windowsweep either way.

## The move, step by step

1. Look first. This deletes nothing:

   ```powershell
   npx windowsweep --scan
   ```

2. Rehearse the sections that do this job. Each line says what it would remove, and nothing goes:

   ```powershell
   npx windowsweep --dry-run --only 1,2,8 --yes
   ```

3. Run them. There is no undo for a cache it deletes, though the program rebuilds it:

   ```powershell
   npx windowsweep --only 1,2,8 --yes
   ```

4. Prefer a window? The [desktop app](../desktop.md) drives the same engine. A real run there counts against your plan's allowance. A dry-run and the command line never do.

Sections 1 and 2 keep what you used in the last hundred days when you answer yes to the [developer question](../developer-mode.md).

Read the [safety model](../safety-model.md) if you want to see what every run refuses.

## The facts, as read on 7 November 2026

Microsoft PC Manager's own pages, copied as they stood that day. A price can change the day after it is read, so [open Microsoft PC Manager's site](https://pcmanager.microsoft.com/en-us) before you buy.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| Microsoft PC Manager | $0 | The Microsoft Store listing title reads Free download and install on Windows | [Source](https://apps.microsoft.com/detail/9pm860492szd), read 7 November 2026 |

windowsweep's current prices and its Free plan's run limit are on the [pricing page](https://windowsweep.aoneahsan.com/pricing).

| The job | Microsoft PC Manager | windowsweep |
|---|---|---|
| Clears browser and app caches | Not stated on the pages we checked | Yes |
| Clears log files | Not stated on the pages we checked | Yes |
| Clears tracking cookies | Not stated on the pages we checked | No |
| Finds folders left by removed software | Not stated on the pages we checked | Yes |
| Uninstalls programs | Not stated on the pages we checked | Yes |
| Free to use | Yes ([source](https://apps.microsoft.com/detail/9pm860492szd)) | Yes |
| Open source | Not stated on the pages we checked | Yes |
| States no ads or bundled offers | Not stated on the pages we checked | Yes |

"Not stated on the pages we checked" is not a no. The page did not say. The side-by-side version is at [Microsoft PC Manager and windowsweep](https://windowsweep.aoneahsan.com/compare/microsoft-pc-manager).
