# GitHub Projects Automation Setup Guide

## Overview

This guide explains how to set up automated GitHub Projects management for your repository. The automation links PRs to story issues and updates project status automatically.

## The Problem

GitHub Actions' default `GITHUB_TOKEN` has a bug where the `project: write` permission doesn't work properly. This is a known GitHub issue that affects many repositories.

## The Solution

Use a **Personal Access Token (PAT)** stored as a GitHub Secret instead of relying on `GITHUB_TOKEN`.

## Setup Steps

### 1. Create a Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `GitHub Projects Automation`
4. Set expiration (recommended: 90 days or custom)
5. Select these scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `write:org` (if project is under an organisation)
   - ✅ `project` (Full control of projects)
6. Click **"Generate token"**
7. **Copy the token immediately** (you won't see it again!)

### 2. Add Token as GitHub Secret

1. Go to your repository: https://github.com/jerryagenyi/ccip
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `GITHUB_PAT`
5. Value: Paste your Personal Access Token
6. Click **"Add secret"**

### 3. Verify Project Configuration

1. Go to your project: https://github.com/users/jerryagenyi/projects/2
2. Verify it has a **Status** field with these options:
   - Backlog
   - Drafted
   - Ready for Dev
   - In Progress
   - Review
   - Done

If the Status field doesn't exist or is missing options:
1. Click **"..."** menu (top right) → **Settings**
2. Scroll to **Fields**
3. Add or edit the **Status** field

### 4. Enable the Workflow

The workflow is already created at `.github/workflows/link-pr-to-story.yml`. It will:
- ✅ Extract story references (US-XXX) from PR titles/bodies
- ✅ Find the corresponding GitHub issue
- ✅ Add the PR to your project
- ✅ Set PR status to "In Progress"
- ✅ Link PR to the story issue

## How It Works

### When You Create a PR

1. **PR Title/Body** must contain a story reference: `US-001`, `US-002`, etc.
2. **Workflow triggers** automatically on PR open/update
3. **Finds story issue** with matching `story` label
4. **Adds PR to project** and sets status to "In Progress"
5. **Links PR** to the story issue

### Example PR Format

```markdown
Title: feat: Implement US-001 User Registration

Description:
Implements US-001: User Registration & Authentication

Related to: #123
```

The workflow will:
- Extract `US-001` from the title
- Find issue #123 (with `story` label)
- Add PR to project
- Set status to "In Progress"

## Troubleshooting

### "Failed to get project ID"

**Problem:** Project not found or wrong project number

**Solution:**
1. Check project URL: `https://github.com/users/jerryagenyi/projects/2`
2. Verify project number is `2` in workflow (line 76)
3. Ensure `GITHUB_PAT` secret is set correctly

### "Failed to add PR to project"

**Problem:** Token doesn't have proper permissions

**Solution:**
1. Regenerate PAT with all required scopes:
   - `repo`
   - `write:org` (if applicable)
   - `project`
2. Update `GITHUB_PAT` secret
3. Re-run the workflow

### "Story issue not found"

**Problem:** No issue exists with matching story reference

**Solution:**
1. Create a GitHub issue for the story
2. Add label: `story`
3. Include story reference (US-XXX) in title or body
4. Re-run the workflow

### "No status field ID found"

**Problem:** Project doesn't have a Status field

**Solution:**
1. Go to project settings
2. Add a **Status** field (Single Select)
3. Add options: Backlog, Drafted, Ready for Dev, In Progress, Review, Done
4. Re-run the workflow

## Testing the Workflow

1. **Create a test PR:**
   ```bash
   git checkout -b test/US-001-automation
   git commit --allow-empty -m "test: Test GitHub Projects automation"
   git push origin test/US-001-automation
   ```
   
   Then create a PR with title: `test: Test US-001 automation`

2. **Check workflow run:**
   - Go to: **Actions** tab
   - Find the "Link PR to Story in Project" workflow
   - Check if it succeeds

3. **Verify in project:**
   - Go to: https://github.com/users/jerryagenyi/projects/2
   - Check if PR appears in project
   - Verify status is "In Progress"

## Security Best Practices

1. **Token Expiration:**
   - Set PAT to expire in 90 days
   - Set a reminder to rotate it

2. **Token Scope:**
   - Only grant minimum required permissions
   - Don't use admin tokens

3. **Secret Management:**
   - Never commit tokens to code
   - Use GitHub Secrets only
   - Rotate tokens periodically

4. **Access Control:**
   - Limit who can modify workflow files
   - Use branch protection on `.github/workflows/`

## Alternative: Manual Updates

If automation isn't working, you can manually update the project:

1. Go to project: https://github.com/users/jerryagenyi/projects/2
2. Click **"+"** → **Add item** → Select PR
3. Set Status field to desired value

See `docs/GITHUB_PROJECTS_UPDATE_GUIDE.md` for more manual methods.

## Related Files

- Workflow: `.github/workflows/link-pr-to-story.yml`
- Manual guide: `docs/GITHUB_PROJECTS_UPDATE_GUIDE.md`
- Sync script: `scripts/sync-to-github-projects.py`

## References

- [GitHub Projects API](https://docs.github.com/en/graphql/reference/objects#projectv2)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

