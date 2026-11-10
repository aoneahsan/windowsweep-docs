---
title: 'Moving from BleachBit'
description: 'What BleachBit users get from windowsweep, what stays with BleachBit, and the commands in order.'
tags: [compare, moving]
---

# Moving from BleachBit

**Last checked 7 November 2026.** BleachBit is an open-source cleaner for Windows and Linux. It previews every file before deletion, can shred files and wipe free space, and has no run count at all.

If you use it for cookies, history and browser traces, on Linux, or with CleanerML rules you wrote yourself, stay with it: windowsweep does none of that and refuses to touch cookies. What windowsweep adds is the part BleachBit's page does not state. It finds orphaned AppData and leftover Program Files folders, uninstalls programs from the same tool, and its desktop window syncs run history to your account.

## Keep BleachBit, add the leftovers

The two can sit on one machine. Sections 7 to 10 do the same cache and temp work BleachBit does, and section 12 adds Windows Update and system temp from an elevated run. The [sections page](../sections.md) lists every path.

BleachBit keeps these:

- Cookies, history, saved passwords and browser traces. windowsweep leaves them alone in every browser profile.
- Shredding, free-space wiping, Linux and your CleanerML rules.

## Start where BleachBit stops

1. Ask what removed programs left in AppData. The dry-run lists folders no installed program claims and removes nothing:

   ```powershell
   npx windowsweep --dry-run --only 23
   ```

2. Pick from that list for real. Section 23 never picks for you, and what you choose goes to the Recycle Bin:

   ```powershell
   npx windowsweep --only 23
   ```

3. Do the same under Program Files and ProgramData. Section 27 needs an elevated run:

   ```powershell
   npx windowsweep --only 27 --elevate
   ```

4. Uninstall what you no longer use with section 26, which runs each program's own registered uninstaller. Uninstalling is permanent:

   ```powershell
   npx windowsweep --only 26
   ```

BleachBit can stay on cache duty. If you would rather windowsweep took that too, rehearse with `npx windowsweep --dry-run --only 7,8,9,10 --yes`, then drop `--dry-run`.

The [desktop app](../desktop.md) drives the same engine and is where run history syncs. Its real runs count against your plan's allowance; a dry-run or the command line never does. The [safety model](../safety-model.md) has the paths every run refuses.

## BleachBit's price, 7 November 2026

From BleachBit's own page that day. [Open BleachBit's site](https://www.bleachbit.org/) to see it as it stands now.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| BleachBit | $0 | The page says 100% free forever, GPLv3 | [Source](https://www.bleachbit.org/), read 7 November 2026 |

windowsweep's prices and its Free plan's run limit: the [pricing page](https://windowsweep.aoneahsan.com/pricing).

## Job by job

| The job | BleachBit | windowsweep |
|---|---|---|
| Clears browser and app caches | Yes ([source](https://www.bleachbit.org/)) | Yes |
| Clears log files | Yes ([source](https://www.bleachbit.org/)) | Yes |
| Clears tracking cookies | Yes ([source](https://www.bleachbit.org/)) | No |
| Finds folders left by removed software | Not stated on the pages we checked | Yes |
| Uninstalls programs | Not stated on the pages we checked | Yes |
| Free to use | Yes ([source](https://www.bleachbit.org/)) | Yes |
| Open source | Yes ([source](https://www.bleachbit.org/)) | Yes |
| States no third-party ads or bundled offers | Yes ([source](https://www.bleachbit.org/)) | Yes |

Two rows read "Not stated on the pages we checked": BleachBit's page was silent on them, which is not the same as no. On the website: [BleachBit and windowsweep](https://windowsweep.aoneahsan.com/compare/bleachbit).
