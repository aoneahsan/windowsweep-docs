---
title: 'Moving from Microsoft PC Manager'
description: 'How windowsweep sits beside Microsoft PC Manager, and the commands that cover what it does not name.'
tags: [compare, moving]
---

# Moving from Microsoft PC Manager

**Last checked 7 November 2026.** Microsoft PC Manager is Microsoft's own cleanup and health app for Windows 10 and 11, installed from the Microsoft Store, with a boost button, storage management and pop-up management. It may well be all you need, and nothing here asks you to remove it.

windowsweep is for a narrower want: seeing each path before it is touched, finding the folders removed programs left, and reading the source of the engine that does it. If you write code on this machine, it also reaches caches PC Manager's page does not name.

## What windowsweep adds beside it

Sections 1 and 2 cover package-manager and build-tool caches, and section 8 covers desktop-app caches. Sections 23 and 27 list folders removed programs left behind. The [sections page](../sections.md) names every path.

PC Manager keeps these:

- The boost button, the health check and pop-up management. windowsweep has no equivalent.
- Tracking cookies are untouched either way; windowsweep never clears them.

## Adding the developer caches

1. Answer the [developer question](../developer-mode.md) honestly on your first interactive run. With yes, sections 1 and 2 keep anything you used in the last hundred days; with no, they clear those caches completely.

2. Rehearse the three cache sections. Each line names a path, and nothing is removed:

   ```powershell
   npx windowsweep --dry-run --only 1,2,8 --yes
   ```

3. Run them. A package or build cache has no undo, but the next install or build fetches what it needs again:

   ```powershell
   npx windowsweep --only 1,2,8 --yes
   ```

4. Go through the leftovers. Both sections ask you to pick, and section 27 needs elevation:

   ```powershell
   npx windowsweep --only 23,27 --elevate
   ```

The [desktop app](../desktop.md) runs this same engine. A real run there uses up your plan's allowance; dry-runs and the command line do not. What windowsweep will never delete is set out in the [safety model](../safety-model.md).

## The price, 7 November 2026

Read from Microsoft's pages that day. [Open Microsoft PC Manager's site](https://pcmanager.microsoft.com/en-us) for the current listing.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| Microsoft PC Manager | $0 | The Microsoft Store listing title reads Free download and install on Windows | [Source](https://apps.microsoft.com/detail/9pm860492szd), read 7 November 2026 |

windowsweep's plans, and how many real runs the Free plan includes: the [pricing page](https://windowsweep.aoneahsan.com/pricing).

## What Microsoft's pages state

Of the eight jobs compared across these guides, Microsoft's pages stated one: that PC Manager is free. They did not say whether it clears browser and app caches, log files or tracking cookies, finds folders left by removed software, uninstalls programs, is open source, or states no ads or bundled offers, so those rows are hidden. Silence on a page is not a no.

| The job | Microsoft PC Manager | windowsweep |
|---|---|---|
| Free to use | Yes ([source](https://apps.microsoft.com/detail/9pm860492szd)) | Yes |

The website compares the two at [Microsoft PC Manager and windowsweep](https://windowsweep.aoneahsan.com/compare/microsoft-pc-manager).
