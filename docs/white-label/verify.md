---
title: 'Verify a white-label licence'
description: 'Check a windowsweep white-label licence by its key or by the website that offers a branded build, and what the licence file at /.well-known contains.'
tags: [white-label, licensing, verification]
---

# Verify a white-label licence

Anyone can check a licence on the [verify page](https://windowsweep.aoneahsan.com/verify-license). Verification is run by windowsweep's licensing service, and the answer shows only public fields: the holder, the product, the groups, the domains, the status and the dates. It never shows an email address or a price.

## By key

A key starts with `WINDOWSWEEP-WL-`. The answer is one of: valid, issued and still being set up, revoked, or not found.

## By website

A website that offers a branded build can serve a licence file at:

```text
/.well-known/windowsweep-white-label-license.json
```

The licensing service reads that file over HTTPS and checks the key it names against the website's own domain. The file names the product, the key, the holder, the domain, a link back to the verify page and the issue date. The windowsweep team adds it when it publishes your build; you do not write it.

The command-line tool and the desktop installers do not contact the licensing service. The check is something a person runs, not something your users' machines do.
