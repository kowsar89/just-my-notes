title: How I Use AI to Assist My Code Review Process (Obsolete, May 29 version)
date: 2025-05-29
categories:
  - Development
tags:
  - AI
---

> ⚠️ Update: A newer version of this post is available — {% post_link using-ai-for-code-review %}.

## 🛠️ Step-1: Getting the Diff View of a Merge Request

When a GitLab Merge Request (MR) is assigned to me, I go straight to the raw diff view. This gives me a cleaner view of what changed. The trick is simple: just add `.diff` to the end of the MR URL.

For example, if the original MR URL is: https://gitlab.com/kowsar89/project-name/-/merge_requests/1200

Then the `.diff` URL becomes: https://gitlab.com/kowsar89/project-name/-/merge_requests/1200.diff

I open that in my browser and copy the entire diff text.

**💡 Note:** This same `.diff` trick works for GitHub Pull Requests (PR) too — just add `.diff` at the end of the PR URL.

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

This GPT is fine-tuned to understand WordPress and PHP context, so it often provides much more relevant insights than the default GPT-4o model.