# Just My Notes

A personal notes and documentation site built with Jekyll using the Chirpy theme.

## Editing Content on GitHub

This repository is configured for direct editing on GitHub:

1. Navigate to the `_posts` directory to edit or create new posts
2. Use the GitHub web editor to create/edit Markdown files
3. Follow the Jekyll naming convention: `YYYY-MM-DD-title.md`
4. Include the necessary front matter at the top of each post:

```markdown
---
title: Your Post Title
date: YYYY-MM-DD HH:MM:SS +0600
categories: [Category]
tags: [tag1, tag2]
---
```

5. Commit your changes directly to the repository

## GitHub Pages Deployment

This site is configured for GitHub Pages. The GitHub Actions workflow is set to run manually:

1. After committing your changes to GitHub
2. Go to the "Actions" tab in the repository
3. Select the "Build and Deploy" workflow
4. Click "Run workflow" and select the branch to build from

## Customization

Edit the `_config.yml` file to customize the site settings.

[gem]: https://rubygems.org/gems/jekyll-theme-chirpy
[chirpy]: https://github.com/cotes2020/jekyll-theme-chirpy/
[CD]: https://en.wikipedia.org/wiki/Continuous_deployment
[mit]: https://github.com/cotes2020/chirpy-starter/blob/master/LICENSE
