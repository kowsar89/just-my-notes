---
title: How I modified my plugin's readme.txt on the WordPress repo using SVN (Linux)
date: 2025-04-09
categories:
  - Development
tags:
  - SVN
---
I recently needed to update the `readme.txt` file inside a specific tag (`tags/4.1`) of my WordPress plugin hosted on WordPress.org.

---

## 🔧 Goal

Update the following line in `readme.txt` inside `tags/4.1`:

```
Tested up to: 6.8
```

---

## 🛠️ Prerequisites

Make sure SVN (Subversion) is installed on your system. I’m using Ubuntu, so I installed it with:

```bash
sudo apt update
sudo apt install subversion
```

---

## 📥 Step 1: Checkout the Plugin

Replace `your-plugin-slug` with your actual plugin slug. For me, it's `woocommerce-filter-orders-by-product`.

```bash
svn checkout https://plugins.svn.wordpress.org/woocommerce-filter-orders-by-product
cd woocommerce-filter-orders-by-product
```

This downloads the full plugin structure, including:

* `/trunk`
* `/tags/4.1`
* `/branches`

---

## 📂 Step 2: Navigate to the Tag Directory

```bash
cd tags/4.1
```

---

## 📝 Step 3: Edit the File

I opened `readme.txt` using nano, but you can use any editor:

```bash
nano readme.txt
```

Then I updated the line:

```
Tested up to: 6.8
```

Saved the file and exited the editor.

---

## ✅ Step 4: Commit the Change

To commit only the `readme.txt` file and include my WordPress.org SVN username (but **not** the password), I ran:

```bash
svn commit -m "Updating supported WP version to 6.8" --username=kowsar89 readme.txt
```

SVN then prompted me for my password securely in the terminal.

---

## 🕒 Step 5: Wait a Few Minutes

After a few minutes, the change was reflected in the plugin's readme file on the WordPress.org plugin page under version 4.1.

---

## ✅ Bonus: Check Your Changes Before Committing

Optional but helpful:

```bash
svn diff readme.txt       # See what's changed
svn status                # See what files are modified
```

---

## 🧠 Final Thoughts

This was a good reminder that SVN is different from Git — you commit from within specific directories, and you commit files explicitly.