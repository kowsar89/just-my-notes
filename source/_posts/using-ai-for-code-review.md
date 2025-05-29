title: How I Use AI to Assist My Code Review Process
date: 2025-05-29
categories:
  - Development
tags:
  - AI
---

As someone who spends most of their time reviewing code, I’ve been integrating AI into my code review workflow ever since ChatGPT became publicly available. Over time, as new AI tools and models emerged, my approach evolved. AI is changing rapidly, so this post is just a snapshot of how I use it **today — May 29, 2025**. It might become outdated pretty quickly, but here’s how I currently use AI to support my code review work.

## 🧠 Why I Use AI in Code Reviews

AI is not a replacement for a human reviewer. It’s a tool — one that helps me think better, catch more edge cases, and question assumptions. It often highlights potential issues that are easy to miss with the human eye, especially when reviewing large or repetitive changes. That said, it also introduces noise: false positives, overly strict suggestions, and occasional nonsense. So it’s essential to treat AI suggestions as advisory, not authoritative.

## 🛠️ Step-1: Getting the Diff View of a Merge Request

When a GitLab Merge Request (MR) is assigned to me, I go straight to the raw diff view. This gives me a cleaner view of what changed. The trick is simple: just add `.diff` to the end of the MR URL.

*For example, if the original MR URL is*: https://gitlab.com/kowsar89/project-name/-/merge_requests/1200

*Then the `.diff` URL becomes*: https://gitlab.com/kowsar89/project-name/-/merge_requests/1200.diff

I open that in my browser and copy the entire diff text.

## 📝 Step-2: Feed the Diff into ChatGPT

Once I have the diff, I paste it into ChatGPT along with a specific prompt. Here's what the full prompt usually looks like:

> ```
> diff --git a/woocommerce-filter-orders-by-product.php b/woocommerce-filter-orders-by-product.php
> index 8ad0e2f..fc22c06 100644
> --- a/woocommerce-filter-orders-by-product.php
> +++ b/woocommerce-filter-orders-by-product.php
>  
> -FOA_Woo_Filter_Orders_by_Product::instance();
> \ No newline at end of file
> +FOA_Woo_Filter_Orders_by_Product::instance();
> ```
> /-----
> Analyze the provided diff content of the code changes and see if you find any problem. I'm only interested in any new issue occurred due to code changes only, nothing else. Note that, strict_types=1 is not declared anywhere. And code should be compatible with PHP 7.2+ and WordPress 4.9+

This helps me quickly get a second opinion from the AI on whether any potential issues have been introduced.

## 🧠 Step-3: Use the Right GPT for the Job

For code reviews, I use a custom GPT named **WordPress Wizard**, which is available in the ChatGPT Plus subscription. To access it:

1. Go to the ChatGPT sidebar.
2. Click on 'GPTs'.
3. Search for **WordPress Wizard**.
4. Open it and start a chat — it will then be pinned to your sidebar for easy reuse.

This GPT is fine-tuned to understand WordPress and PHP context, so it often provides much more relevant insights than the default GPT-4 model.

## ⚠️ Important Notes & Cautions

* This AI workflow is only for **code review**, not development. I have a separate setup for writing or debugging code.
* AI helps me think, but I never blindly trust its output. It can produce false positives — sometimes sounding very confident while being completely wrong. So I treat every suggestion with a critical eye.
* It sometimes slows down the review process, but the trade-off is worth it because I catch more edge cases and subtle bugs.

## ✅ Final Thoughts

Integrating AI into my code review workflow has significantly improved the quality of my reviews. While it doesn't replace my judgment, it complements it — especially when it comes to catching tricky or edge-case issues. As with any tool, the key is knowing how and when to use it. For now, this setup works well — and I’ll continue evolving it as the AI landscape changes.
