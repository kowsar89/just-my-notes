---
title: How to Downgrade a .deb Package on Ubuntu
date: 2025-03-25
categories:
  - Software
tags:
  - Linux
---
Sometimes a newer version of an app doesn’t work as expected — maybe it's buggy, has UI issues, or just doesn't suit your workflow. This can be frustrating, especially when there's no built-in way to roll back to a previous version. Fortunately, on Ubuntu (or any Debian-based Linux distribution), you *can* downgrade `.deb` packages manually.

In this post, I’ll show you how to downgrade an already-installed `.deb` package using `dpkg`, and explain why tools like `gdebi` might not work in this case. We’ll use **Local by Flywheel** as a practical example.

## Why Downgrade?

Let’s say you updated **Local by Flywheel** to version `9.2.4`, but after the update, you noticed UI issues — for instance, **blurry sidebar text**. Since the issue didn’t exist in version `9.2.2`, you want to go back.

Trying to install the older `.deb` package with `gdebi` might give you this error:

```bash
This package is uninstallable
A later version is already installed
```

That’s because `gdebi` doesn’t support forcefully downgrading packages. But don't worry — there’s a workaround using `dpkg`.


## How to Downgrade Using `dpkg`

Here’s how you can force the installation of an older `.deb` package even if a newer version is installed:

1. Open your terminal.
2. Navigate to the directory where your `.deb` file is located:

   ```bash
   cd ~/Downloads
   ```
3. Run the following command to downgrade (replacing the filename if necessary):

   ```bash
   sudo dpkg -i --force-downgrade local-9.2.2-linux.deb
   ```

That’s it! This command tells `dpkg` to install the `.deb` package and *force* the downgrade, bypassing version checks.


## After Downgrade: Fix Dependencies

If the downgrade causes dependency issues, fix them using:

```bash
sudo apt-get install -f
```

This ensures that your system resolves any broken packages after the downgrade.


## A Word of Caution

Downgrading packages can be risky if:

* The app depends on system-wide libraries that changed in the newer version.
* Other apps rely on the newer version.

Always check for potential side effects and consider backing up your data before proceeding.


## Conclusion

While Ubuntu doesn't provide a built-in tool to downgrade `.deb` packages easily, `dpkg` gives you full control — if you know how to use it. In cases like Local by Flywheel, going back to an earlier version can solve unexpected problems introduced in newer updates.