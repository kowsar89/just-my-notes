title: How I Use AI to Assist My Code Review Process
date: 2025-09-19
categories:
  - Development
tags:
  - AI
  - Code Review
---

As someone who spends most of their time reviewing code, I’ve been integrating AI into my code review workflow ever since ChatGPT became publicly available. Over time, as new AI tools and models emerged, my approach evolved. AI is changing rapidly, so this post is just a snapshot of how I use it **today — September 19, 2025**. It might become outdated pretty quickly, but here’s how I currently use AI to support my code review work.

## 🧠 Why I Use AI in Code Reviews

AI is not a replacement for a human reviewer. It’s a tool — one that helps me think better, catch more edge cases, and question assumptions. It often highlights potential issues that are easy to miss with the human eye, especially when reviewing large or repetitive changes. That said, it also introduces noise: false positives, overly strict suggestions, and occasional nonsense. So it’s essential to treat AI suggestions as advisory, not authoritative.

## 🛠️ Step-1: Setting Up Codex in Cursor/VSCode

I use the **OpenAI Codex extension** inside Cursor (VSCode Fork). It supports authentication with either an OpenAI API key or a ChatGPT subscription — I just use my existing ChatGPT Plus subscription.  

In Codex, I run it in **Agent (full access) mode**, which allows it to use my system tools without interruptions. For code reviews, I prefer the **gpt-5-high** model. There’s also a `gpt-5-codex-high` variant, but I’ve found `gpt-5-high` gives the best results for review tasks.

## 📝 Step-2: My Review Instruction File

At the root of my project, I keep a file named `_code-review.md`. This file contains all the rules the AI should follow when performing a review. Here's the content of the file as gist: https://gist.github.com/kowsar89/d99ca34b5f8ce4e58d454c0267ad71dd

Because everything is already written in `_code-review.md`, I never need to re-explain my workflow — Codex just follows the file.

## 🔧 Step-3: Running a Review

When a GitLab MR needs reviewing, I simply ask Codex to use `_code-review.md` with the MR number. Like following: 

![Codex Code Review](/images/codex.png)

Since `glab` is already installed and authenticated on my system, Codex runs the command, fetches the diff, and starts analyzing it right away.

## 📂 Step-4: Reading the Results

After completing the review, Codex writes the results to `~/ai-coding/code-reviews/` directory as per the instruction file ie `~/ai-coding/code-reviews/1971.md`.

I use a Markdown browser extension, so I can open the file directly in my browser and read the formatted output with zero extra effort.

![Codex Code Review Output](/images/review-output.png)

## ⚠️ Important Notes & Cautions

* This AI workflow is only for **code review**, not development. I have a separate setup for writing or debugging code.
* AI helps me think, but I never blindly trust its output. It can produce false positives — sometimes sounding very confident while being completely wrong. So I treat every suggestion with a critical eye.
* It sometimes slows down the review process, but the trade-off is worth it because I catch more edge cases and subtle bugs.

## ✅ Final Thoughts

Integrating AI into my code review workflow has significantly improved the quality and speed of my reviews. While it doesn’t replace my judgment, it complements it — especially when it comes to catching tricky or edge-case issues. As with any tool, the key is knowing how and when to use it. For now, this setup works well — and I’ll continue evolving it as the AI landscape changes.
