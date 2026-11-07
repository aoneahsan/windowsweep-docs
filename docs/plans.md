---
title: 'Use a desktop plan'
description: 'How real-run allowances, Pro, Team, checkout and referrals work in windowsweep.'
tags: [desktop, plans, runs]
---

# Use a desktop plan

Open **Plans** to see your current plan and how many real runs remain; a plan changes the desktop allowance and extra features while all 30 sections and their protected-path checks stay the same. Even when no real runs remain this month, a dry-run, scan, report-only run or command-line run is never counted.

## How many real runs remain?

Open **Plans** in the desktop app. The allowance shows this machine's count and, when you are signed in, your account's extra count. The app uses this machine's allowance first, then the account's. Both reset at 00:00 UTC on the first day of the month. [Pricing](https://windowsweep.aoneahsan.com/pricing) shows the current limits and prices.

The app asks the account service for a claim immediately before a real run. No claim, no run. If there are no runs left, the run does not start. If the service cannot be reached, the real run waits. A dry-run still works. A run that only reads and reports is not counted.

## What do Free, Pro and Team include?

Free keeps signed-in run-summary sync, History across machines and the report exported from an individual run. Pro removes the monthly real-run limit and adds the desktop weekly schedule, a report across your machines and a history export. Team gives each seat Pro and adds one fleet report. The fleet report shows each member's runs by machine with date, mode, section count and bytes reclaimed. It never shows a path, file name, machine name or Windows user name.

The command-line `--install-task` remains available without a desktop plan. A Free user's old desktop weekly task is removed on the first start of 1.4.0, with a one-time notice; a command-line task is left alone.

## How do I buy Pro or Team?

Choose **Subscribe to Pro** or **Subscribe to Team**, on **Plans** in the desktop app from version 1.4.4 or on [Pricing](https://windowsweep.aoneahsan.com/pricing). A plan belongs to an account. Signed out, both buttons ask you to sign in with Google first. On Plans, Polar's checkout page opens in your browser, and Plans shows the plan once Polar confirms the payment. On Pricing, the browser leaves for Polar's checkout in the same tab, and the plan shows on your account once Polar confirms it. Either way, the checkout carries your Monthly or Yearly choice and, for Team, the seat count.

Polar is the merchant of record: it takes the payment, adds any sales tax or VAT and issues the receipt. It also hosts the customer portal and emails each buyer its link.

If you requested a plan while checkout was closed, the windowsweep team emails you a link to pay, which opens Pricing with the period and seats you asked for already chosen. The request alone grants nothing. Until a payment is recorded, your current plan stays in effect.

## How do referral rewards work?

Sign in and open **Plans** to find your invite code. Choose **Copy the invite link** and share it with your friend; the link opens the website with the code ready for sign-in. A friend counts when a new account is linked with the code inside the sign-up window and its email is verified before the claim window closes. Plans shows the current points, threshold and reward settings. It does not name the friend.

Referral Pro time waits behind paid Pro or Team time. If paid or Team coverage starts during a reward, the uncovered part is kept for later. A fully banked reward moves after later paid or Team coverage. **Plans** shows when a reward is waiting or paused. A voided referral can remove the points and any surplus reward time tied to it. Paid time is unaffected.

See [Safety model](./safety-model.md) for the paths every plan refuses, and [Desktop app](./desktop.md) for what the window sends.
