---
title: Git Basics - A Quick Guide
date: 2024-03-23 22:00:00 +0600
categories: [Development, Version Control]
tags: [git, github, version control]
---

# Git Basics - A Quick Guide

Git is a distributed version control system that helps you track changes in your code. Here's a quick guide to get you started.

## Essential Git Commands

### Setting Up

```bash
# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### Basic Workflow

```bash
# Initialize a repository
git init

# Add files to staging
git add <filename>
git add .  # Add all files

# Commit changes
git commit -m "Your commit message"

# Check status
git status
```

### Working with Remotes

```bash
# Add a remote
git remote add origin <repository-url>

# Push changes
git push origin main

# Pull changes
git pull origin main
```

## Best Practices

1. Write clear commit messages
2. Commit often
3. Use branches for new features
4. Keep your repository clean

## Common Git Workflows

### Feature Branch Workflow

1. Create a new branch
2. Make changes
3. Push to remote
4. Create pull request
5. Merge after review

### Git Flow

- main/master branch for production
- develop branch for development
- feature branches for new features
- hotfix branches for urgent fixes
