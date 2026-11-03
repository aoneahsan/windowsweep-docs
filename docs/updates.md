---
title: 'Install a required update'
description: 'What a windowsweep update notice means and how to install it in the desktop app, website and docs.'
tags: [updates, desktop, troubleshooting]
---

# Install a required update

Choose **Update** when the desktop app says a release is required. An urgent release blocks an older copy when found; a normal release shows a notice first and blocks from the next start. The notice names the required version and the reason for a block.

## How do I update the desktop app?

Choose **Update** in the notice or block. The app downloads and verifies the signed update. A run already in progress finishes before installation begins. The release screen tells you when the update is downloaded and verified and when installation begins. Your settings and History remain. If the download fails, choose **Try again** while online. The block screen also links to the [release page](https://github.com/aoneahsan/windowsweep/releases) for a manual installer and to [support issues](https://github.com/aoneahsan/windowsweep/issues) if the installer fails.

The app checks for a published release when it opens, when a release is announced, and when it returns to view or reconnects. If the release service cannot be reached, it continues and checks again on return; a published block is not silently dismissed.

## How do I update the website or docs?

Choose **Update now** in a notice or block. The page reloads. It picks up the newest site build. A normal release becomes required from the next page load; an urgent one blocks older builds immediately. A failed reload leaves **Try again** and a support link available. A form draft is kept only where the browser confirms that it was saved before the block; do not rely on a page reload to preserve unsaved text.

The command-line engine makes no automatic network call and checks no release on its own. Its version changes when you install a newer package. Read [Safety model](./safety-model.md) for the engine's protected-path refusals and [Desktop app](./desktop.md) for the window's separate network behaviour.
