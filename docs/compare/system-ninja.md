---
title: 'Moving from System Ninja'
description: 'What carries across from System Ninja to windowsweep, what does not, and the commands in order.'
tags: [compare, moving]
---

# Moving from System Ninja

**Last checked 7 November 2026.** System Ninja is a small Windows cleaner from SingularLabs. The free edition clears cookies and browser history from more than thirty browsers, and the Pro edition comes with the yearly Pro Club membership.

Stay with System Ninja if cookies and history are the point, or you use its process manager or the portable Pro edition. windowsweep leaves cookies and history alone. It earns its place with leftover folders from removed software, admin-only sections such as Windows Update caches and event logs, and run reports you can export.

## Cache work, admin sections, leftovers

Sections 7 to 10 cover browser, desktop-app and Windows user caches and user temp. Sections 12 and 16 reach Windows Update caches and event logs when elevated; section 16 is permanent. The [sections page](../sections.md) lists the paths.

System Ninja keeps:

- Clearing cookies and history.
- The process manager and the portable Pro edition.

## Bringing the browser routine across

1. Close every browser. Section 7 skips an open one entirely and touches only cache folders, never profile data. It knows Chrome, Edge, Brave, Vivaldi, Opera and Firefox among others; the sections page has the full list.

2. Rehearse the four cache sections:

   ```powershell
   npx windowsweep --dry-run --only 7,8,9,10 --yes
   ```

3. Run them. Once a cache is deleted it is gone, though the browser or app rebuilds it:

   ```powershell
   npx windowsweep --only 7,8,9,10 --yes
   ```

4. Take the Windows Update cache from an elevated run, rehearsing first. Section 16 is deep-gated and stays out of this:

   ```powershell
   npx windowsweep --dry-run --only 12 --elevate --yes
   ```

5. Export the run report as a page you can keep:

   ```powershell
   npx windowsweep --export html latest
   ```

Section 23 lists orphaned AppData folders and section 27 leftover program folders, neither of which System Ninja's page mentions.

In the [desktop app](../desktop.md), a real run counts against your plan's allowance; dry-runs and the command line are never counted. What windowsweep refuses, and why, is in the [safety model](../safety-model.md).

## SingularLabs' prices, 7 November 2026

From SingularLabs' pages that day. Pro comes through club membership, so [open System Ninja's site](https://singularlabs.com/software/system-ninja/) to see what the club includes now.

| Plan | Price | Terms | Where it was read |
|---|---|---|---|
| System Ninja Free | $0 | - | [Source](https://singularlabs.com/software/system-ninja/), read 7 November 2026 |
| SingularLabs Pro Club | $14.95 a year | Pro Club Standard, 12 months; includes System Ninja Pro | [Source](https://singularlabs.com/club/join/), read 7 November 2026 |

For windowsweep's prices and the Free plan's run limit, see the [pricing page](https://windowsweep.aoneahsan.com/pricing).

## The rows that matter

| The job | System Ninja | windowsweep |
|---|---|---|
| Clears browser and app caches | Yes ([source](https://singularlabs.com/software/system-ninja/)) | Yes |
| Clears log files | Not stated on the pages we checked | Yes |
| Clears tracking cookies | Yes ([source](https://singularlabs.com/software/system-ninja/)) | No |
| Finds folders left by removed software | Not stated on the pages we checked | Yes |
| Uninstalls programs | Yes ([source](https://singularlabs.com/software/system-ninja/)) | Yes |
| Free to use | Yes ([source](https://singularlabs.com/software/system-ninja/)) | Yes |
| Open source | Not stated on the pages we checked | Yes |
| States no third-party ads or bundled offers | Yes ([source](https://singularlabs.com/software/system-ninja/)) | Yes |

The three "Not stated" rows are ones SingularLabs' page did not address, which leaves them open rather than no. On the website: [System Ninja and windowsweep](https://windowsweep.aoneahsan.com/compare/system-ninja).
