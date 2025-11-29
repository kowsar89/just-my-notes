title: How I fixed blurry text in an Electron app (Local by Flywheel) on Linux
date: 2025-06-20
categories:
  - Software
tags:
  - Linux
---
Recently, I encountered a minor but annoying issue with **Local (by Flywheel)** on my Ubuntu machine. After an update, the text inside the app—especially in the sidebar—started to look fuzzy and low-quality. I discovered it was related to a Chromium flag called `FontationsFontBackend`, which could be disabled to fix the rendering.

Sure, I could launch it from the terminal using:

```bash
/opt/Local/local --disable-features=FontationsFontBackend
```

But I didn’t want to open the terminal every time I needed to launch the app. Instead, I wanted to patch the desktop shortcut itself so the flag gets applied automatically, **without touching the terminal again**. Here's how I did it, and this works not just for Local but any Linux app with a `.desktop` file.

## Step-1: Locate the `.desktop` file

Most desktop apps on Linux use `.desktop` launcher files, and they can usually be found in one of these locations:

- `/usr/share/applications/` (for system-wide apps)
- `~/.local/share/applications/` (for per-user custom launchers)

In my case, Local had an entry in:

```

/usr/share/applications/local.desktop

```

You **can directly edit** this file with root permissions:

```bash
sudo nano /usr/share/applications/local.desktop
```

However, a better approach is to copy it to your local applications folder first:

```bash
cp /usr/share/applications/local.desktop ~/.local/share/applications/
```

Then edit the copy instead:

```bash
nano ~/.local/share/applications/local.desktop
```

This way, the change is limited to your user and won’t be lost during a system update or overwritten by package upgrades. It’s cleaner and safer in the long run.

## Step-2: Modify the `Exec` line to add launch flags

Open the `.desktop` file using your favorite text editor:

```bash
nano ~/.local/share/applications/local.desktop
```

Find the line that starts with `Exec=` and update it like this:

```ini
Exec=/opt/Local/local --disable-features=FontationsFontBackend %U
```

You can replace `/opt/Local/local` with the actual path to your app's binary. The `--disable-features=...` part is the flag you're injecting, and `%U` at the end handles file or URL arguments passed by the desktop environment.

Once you're done editing, save and close the file.

## Step-3: Restart your desktop shell (no reboot needed)

Instead of rebooting, you can simply restart your desktop shell to make the updated shortcut take effect. On GNOME, the easiest way is:

* Press `Alt + F2`
* Type `r`
* Hit `Enter`

Alternatively, just log out and log back in.

## Final Result

After applying this, launching Local from the system menu now starts it with the custom flag. The blurry text issue is gone, and I don’t need to run it from the terminal anymore.

This approach is generic and works for any app that accepts command-line flags — whether you want to disable experimental features, enable GPU acceleration, or set up debugging options. Just edit the appropriate `.desktop` file and you’re good to go.

## Conclusion

This was a small tweak, but it saved me time and hassle in the long run. If you're ever in a situation where an app needs special launch flags but you're tired of opening a terminal each time, just patch the `.desktop` launcher — it's a quick and effective fix.
