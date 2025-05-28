---
title: Slack's blue dot notifiation icon was distracting me — so I patched it (Linux Fix)
date: 2025-03-26
categories:
  - Software
tags:
  - Productivity
---
If you're using the Slack desktop application on Linux, you might have noticed the persistent blue circle icon that appears on the taskbar whenever there's activity in any channel. While this feature is designed to keep you informed, it can sometimes be more distracting than helpful, especially if you're part of multiple active channels. In this guide, we'll walk you through a method to disable this blue circle notification by modifying Slack's internal files.

**Important Note:** The steps outlined below involve altering Slack's internal files. Proceed with caution and ensure you have the necessary backups before making any changes. Additionally, these modifications may need to be reapplied after Slack updates.


### Install the `asar` Utility
   Slack's resources are packaged using the Electron framework's `asar` archive format. To modify these resources, you'll need the `asar` utility. Install it globally using npm:

   ```bash
   sudo npm install -g asar
   ```

### Create Backup Directories
   It's crucial to back up the original Slack files before making any changes. Create a backup directory:

   ```bash
   sudo mkdir -p ~/tmp/slack-backup
   ```

### Backup Original Slack Files
   Copy the original `app.asar` file and its unpacked contents to the backup directory:

   ```bash
   sudo cp /usr/lib/slack/resources/app.asar ~/tmp/slack-backup/
   sudo cp -r /usr/lib/slack/resources/app.asar.unpacked ~/tmp/slack-backup/
   ```

### Extract the `app.asar` Archive
   Create a temporary directory and extract the contents of `app.asar` into it:

   ```bash
   sudo mkdir ~/tmp/slack
   sudo env "PATH=$PATH" asar extract /usr/lib/slack/resources/app.asar ~/tmp/slack
   ```

### Modify the Notification Settings
   Navigate to the extracted files and modify the JavaScript responsible for the taskbar notifications:

   ```bash
   sudo sed -i 's/:t>0/:t<0/g' ~/tmp/slack/dist/main.*.js
   ```

   This command changes the condition that controls the display of the blue circle, effectively disabling it.

### Repack the Modified Files
   After making the necessary changes, remove the original `app.asar` and its unpacked directory:

   ```bash
   sudo rm /usr/lib/slack/resources/app.asar
   sudo rm -rf /usr/lib/slack/resources/app.asar.unpacked
   ```

   Then, repack the modified files into a new `app.asar` archive and move it to Slack's resources directory:

   ```bash
   sudo env "PATH=$PATH" asar pack ~/tmp/slack /usr/lib/slack/resources/app.asar
   sudo mv ~/tmp/slack /usr/lib/slack/resources/app.asar.unpacked
   ```

### Restart Slack
   Close and reopen the Slack application for the changes to take effect. The blue circle icon should no longer appear on channel activity.

---

**Additional Considerations:**

* **Slack Updates:** Be aware that updating Slack may overwrite these changes. You might need to repeat this process after each update.

By following these steps, you can customize your Slack experience on Linux to better suit your workflow and minimize distractions.

---

**🛠️ (Optional) Note on Using `PATH=$PATH` with `asar`**

If you’re wondering why I used `sudo env "PATH=$PATH" asar ...` instead of just `sudo asar ...`, here’s the reason:

Even though I had installed `asar` globally using `npm`, running it with `sudo` gave me this error:

```bash
sudo asar ...
# → sudo: asar: command not found
```

But oddly enough, running `asar` without `sudo` worked just fine:

```bash
asar --version
# → v3.2.0
```

This happens because tools like `asar` are often installed under a user-specific path when using Node.js via **NVM (Node Version Manager)**. That path isn't inherited by `sudo`, which uses a more limited environment.

To fix it, I simply told `sudo` to explicitly pass along my current `PATH` like this:

```bash
sudo env "PATH=$PATH" asar ...
```

That way, `asar` is found and executed correctly — with root permissions — without needing to fiddle with symlinks or system-wide installs.

🧠 **TL;DR**: If `asar` works but `sudo asar` doesn’t, use:

```bash
sudo env "PATH=$PATH" asar ...
```

Problem solved. ✔️




**Ref**: [superuser][1]

[1]: https://superuser.com/questions/1211975/slack-app-on-linux-how-to-disable-the-blue-circle-icon-on-channel-activity "Slack app on Linux: How to disable the \"blue circle\" icon on channel ..."

