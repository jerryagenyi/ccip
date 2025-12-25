# GitHub Personal Access Token (PAT) Setup Guide

## Overview

This guide walks you through creating a Personal Access Token (PAT) for GitHub Projects automation. The PAT is needed because `GITHUB_TOKEN` has a known limitation with `project: write` permissions in GitHub Actions.

## Why We Need a PAT

The `.github/workflows/link-pr-to-story.yml` workflow needs to:
- Add PRs to GitHub Projects
- Update project item status
- Link PRs to story issues

While `GITHUB_TOKEN` has `project: write` permission in theory, GitHub has a bug that prevents it from working correctly. Using a PAT with the required scopes bypasses this limitation.

## Step-by-Step Setup

### Step 1: Create a Personal Access Token

1. **Go to GitHub Settings:**
   - Click your profile picture (top right)
   - Click **Settings**
   - Or go directly to: https://github.com/settings/profile

2. **Navigate to Developer Settings:**
   - Scroll down in the left sidebar
   - Click **Developer settings** (at the bottom)
   - Or go directly to: https://github.com/settings/apps

3. **Go to Personal Access Tokens:**
   - Click **Personal access tokens**
   - Click **Tokens (classic)** (or **Fine-grained tokens** if you prefer)
   - Or go directly to: https://github.com/settings/tokens

4. **Generate New Token:**
   - Click **Generate new token**
   - Select **Generate new token (classic)** (recommended for simplicity)

5. **Configure Token:**
   
   **Note:** (required)
   - Enter a descriptive name: `CCIP GitHub Projects Automation`
   - Or: `CCIP - Projects Workflow Token`

   **Expiration:**
   - Choose expiration: **90 days**, **No expiration**, or custom
   - ⚠️ **Important:** If you set expiration, you'll need to rotate the token before it expires

   **Select Scopes:**
   Check these scopes (minimum required):
   - ✅ **`repo`** - Full control of private repositories
     - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
   - ✅ **`project`** - Full control of user projects
     - This allows the workflow to add items to projects and update project fields

   **Optional but Recommended:**
   - ✅ **`read:org`** - Read org and team membership (if using org projects)
   - ✅ **`read:user`** - Read user profile information

6. **Generate Token:**
   - Scroll to bottom
   - Click **Generate token** (green button)

7. **Copy Token Immediately:**
   - ⚠️ **CRITICAL:** Copy the token NOW - you won't be able to see it again!
   - It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Save it temporarily in a secure place (password manager, notes app)

### Step 2: Add Token to Repository Secrets

1. **Go to Repository Settings:**
   - Navigate to: https://github.com/jerryagenyi/ccip
   - Click **Settings** (top navigation)

2. **Go to Secrets:**
   - In left sidebar, under **Security**, click **Secrets and variables**
   - Click **Actions**

3. **Add New Secret:**
   - Click **New repository secret** (top right)

4. **Configure Secret:**
   - **Name:** `GH_PAT`
     - ⚠️ Must be exactly `GH_PAT` (the workflow expects this name)
     - ⚠️ **Important:** Cannot use `GITHUB_PAT` - GitHub reserves `GITHUB_` prefix
   - **Secret:** Paste your PAT token
   - Click **Add secret** (green button)

5. **Verify Secret:**
   - You should see `GH_PAT` in the list
   - The value will be hidden (shows as `••••••••`)

### Step 3: Update Workflow to Use PAT

The workflow needs to be updated to use `GITHUB_PAT` instead of `GITHUB_TOKEN` for project operations.

**Current workflow uses:**
```yaml
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Should be updated to:**
```yaml
env:
  GH_TOKEN: ${{ secrets.GITHUB_PAT }}
```

## Token Security Best Practices

### ✅ Do:
- Use a descriptive token name
- Set appropriate expiration (90 days recommended)
- Store token in GitHub Secrets (never commit to repo)
- Use minimum required scopes
- Rotate token periodically
- Revoke token if compromised

### ❌ Don't:
- Share token publicly
- Commit token to repository
- Use token in client-side code
- Give token more permissions than needed
- Use same token for multiple purposes

## Testing the Setup

After setting up the PAT:

1. **Create a test PR:**
   ```bash
   git checkout -b test/pat-verification
   echo "# Test PAT" >> TEST_PAT.md
   git add TEST_PAT.md
   git commit -m "test: Verify PAT setup"
   git push origin test/pat-verification
   ```

2. **Create PR with story reference:**
   - PR title: `test: Verify PAT setup US-1`
   - This should trigger the workflow

3. **Check workflow run:**
   - Go to: https://github.com/jerryagenyi/ccip/actions
   - Look for "Link PR to Story in Project" workflow
   - Verify it completes successfully

4. **Verify project update:**
   - Go to: https://github.com/users/jerryagenyi/projects/2
   - Check if PR was added to project
   - Verify status is set to "In Progress"

## Troubleshooting

### "Resource not accessible by integration"
- **Problem:** `GITHUB_TOKEN` doesn't have project permissions
- **Solution:** Use PAT with `project` scope (this guide)

### "Bad credentials"
- **Problem:** Token is invalid or expired
- **Solution:** 
  1. Check token hasn't expired
  2. Verify secret name is exactly `GH_PAT` (not `GITHUB_PAT`)
  3. Regenerate token if needed

### "Secret names must not start with GITHUB_"
- **Problem:** Tried to create secret with `GITHUB_` prefix
- **Solution:** Use `GH_PAT` instead (GitHub reserves `GITHUB_` prefix)

### "Insufficient permissions"
- **Problem:** Token missing required scopes
- **Solution:** Regenerate token with `repo` and `project` scopes

### Workflow not running
- **Problem:** Workflow not triggered
- **Solution:**
  1. Check PR has story reference (US-XXX format)
  2. Verify workflow file is in `.github/workflows/`
  3. Check Actions tab for errors

## Token Rotation

If you need to rotate the token:

1. **Generate new token** (follow Step 1)
2. **Update repository secret:**
   - Go to: https://github.com/jerryagenyi/ccip/settings/secrets/actions
   - Click `GH_PAT`
   - Click **Update**
   - Paste new token
   - Click **Update secret**
3. **Revoke old token:**
   - Go to: https://github.com/settings/tokens
   - Find old token
   - Click **Revoke**

## Related Files

- Workflow: `.github/workflows/link-pr-to-story.yml`
- Project: https://github.com/users/jerryagenyi/projects/2
- GitHub Docs: [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

## Quick Reference

**Token Scopes Required:**
- `repo` - Full control of private repositories
- `project` - Full control of user projects

**Secret Name:**
- `GH_PAT` (must match exactly)
- ⚠️ **Cannot use `GITHUB_PAT`** - GitHub reserves `GITHUB_` prefix for their own secrets

**Workflow Usage:**
```yaml
env:
  GH_TOKEN: ${{ secrets.GH_PAT }}
```

