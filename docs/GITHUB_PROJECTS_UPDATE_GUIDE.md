# GitHub Projects Dashboard Update Guide

## Overview

Your GitHub Project is at: https://github.com/users/jerryagenyi/projects/2

This guide explains how to update the project dashboard and why the automation workflows were disabled.

## Current Status

### ✅ Working
- **CI Pipeline** (`.github/workflows/ci.yml`) - Tests run on PRs
- **Deploy Status** (`.github/workflows/deploy.yml`) - Deployment notifications

### ✅ Fixed (Using Personal Access Token)
- **Link PR to Story** (`.github/workflows/link-pr-to-story.yml`) - **Now working!**

**Setup Required:** See `docs/GITHUB_PROJECTS_SETUP.md` for setup instructions.

### ❌ Still Disabled
- **Update Project Status** (`.github/workflows/update-project-status.yml.disabled`)
- **Sync Sprint Status** (`.github/workflows/sync-sprint-status.yml.disabled`)

**Note:** These can be re-enabled using the same PAT approach if needed.

## Manual Project Updates

Since automation is disabled, here's how to manually update your project:

### Method 1: Via GitHub UI (Easiest)

1. **Go to your project:**
   - https://github.com/users/jerryagenyi/projects/2

2. **Add items to project:**
   - Click **"+"** button (top right)
   - Select **"Add item"**
   - Choose from:
     - **Issues** - Link existing issues
     - **Draft issue** - Create new issue in project
     - **Pull requests** - Link PRs

3. **Update item status:**
   - Click on an item card
   - Click the **Status** field dropdown
   - Select new status:
     - Backlog
     - Drafted
     - Ready for Dev
     - In Progress
     - Review
     - Done

4. **Move items between columns:**
   - Drag and drop cards between columns
   - Or use the Status field to change status

### Method 2: Via Issue Labels

1. **Add status labels to issues:**
   - Go to any issue
   - Click **Labels** → **Add labels**
   - Add status label:
     - `status:backlog`
     - `status:drafted`
     - `status:ready-for-dev`
     - `status:in-progress`
     - `status:review`
     - `status:done`

2. **Link story to epic:**
   - Add label: `epic:epic-001` (replace with actual epic number)

3. **Mark as story/epic:**
   - Add label: `story` or `epic`

**Note:** The automation would normally sync these labels to the project, but it's disabled for now.

### Method 3: Via GitHub CLI

```bash
# Add issue to project
gh project item-add 2 --owner jerryagenyi --url https://github.com/jerryagenyi/ccip/issues/123

# Update item field (requires project field ID)
gh api graphql -f query='
  mutation {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: "PVT_kwDO..."
        itemId: "PVTI_..."
        fieldId: "PVTF_..."
        value: { singleSelectOptionId: "..." }
      }
    ) {
      projectV2Item { id }
    }
  }
'
```

**Note:** This requires GraphQL API knowledge and field IDs.

### Method 4: Via Python Script

You have a script at `scripts/sync-to-github-projects.py`:

```bash
# Set GitHub token
export GITHUB_TOKEN=your_token_here

# Run script
python3 scripts/sync-to-github-projects.py
```

**Requirements:**
- GitHub Personal Access Token with `repo` and `write:org` permissions
- Python 3 with `pyyaml` and `requests` installed

## Project Field Configuration

Ensure your project has these fields:

### Required Fields

1. **Status** (Single Select)
   - Options: Backlog, Drafted, Ready for Dev, In Progress, Review, Done

### Optional Fields (Recommended)

2. **Epic** (Text)
   - Store epic identifier (e.g., "Epic 001")

3. **Story ID** (Text)
   - Store story identifier (e.g., "US-001")

4. **Priority** (Single Select)
   - Options: Low, Medium, High, Critical

### Adding Fields

1. Go to project: https://github.com/users/jerryagenyi/projects/2
2. Click **"..."** menu (top right) → **Settings**
3. Scroll to **Fields**
4. Click **"New field"**
5. Configure field type and options

## Workflow: Manual Project Updates

### When Creating a New Story

1. **Create GitHub Issue:**
   - Title: "US-001: User Registration & Authentication"
   - Body: Link to story file or description
   - Labels: `story`, `status:backlog`, `epic:epic-001`

2. **Add to Project:**
   - Go to project dashboard
   - Click **"+"** → **Add item** → Select the issue

3. **Set Status:**
   - Click the issue card
   - Set Status to "Backlog" or "Ready for Dev"

### When Starting Work

1. **Update Issue Status:**
   - Change label: `status:backlog` → `status:in-progress`
   - Or update project Status field: "Backlog" → "In Progress"

2. **Create PR:**
   - Branch: `feature/US-001-user-registration`
   - Title: "feat: Implement US-001 User Registration & Authentication"
   - Body: "Implements US-001. Closes #123" (link to issue)

3. **Link PR to Project:**
   - Go to project
   - Click **"+"** → **Add item** → Select the PR
   - Set Status: "In Progress"

### When PR is Ready for Review

1. **Update Project Status:**
   - Change Status: "In Progress" → "Review"

2. **Request Review:**
   - Add reviewers in PR
   - Wait for approval

### When PR is Merged

1. **Update Project Status:**
   - Change Status: "Review" → "Done"

2. **Close Issue:**
   - PR merge will auto-close linked issue (if you use "Closes #123")

## Setting Up Automation

The **Link PR to Story** workflow is now working! See `docs/GITHUB_PROJECTS_SETUP.md` for complete setup instructions.

**Quick Setup:**
1. Create a Personal Access Token (PAT) with `repo` and `project` scopes
2. Add it as a GitHub Secret named `GITHUB_PAT`
3. The workflow will automatically link PRs to story issues

**To re-enable other workflows:**
1. Follow the same PAT setup process
2. Rename `.disabled` files to `.yml`
3. Update them to use `GITHUB_PAT` instead of `GITHUB_TOKEN`

## Automated Sync Workflows

Your project is configured with automated workflows to sync sprint status with GitHub Projects:

### What's Configured

1. **Sync Sprint Status** - Updates GitHub Project from `docs/sprint-artifacts/sprint-status.yaml`
2. **Auto-Link PRs** - Links pull requests to user stories (via `link-pr-to-story.yml`)
3. **Update Status** - Updates project status when labels change

### How Automated Sync Works

- **Daily sync**: Runs automatically at 9 AM UTC (if enabled)
- **PR linking**: Auto-detects story IDs (US-XXX) in PRs
- **Status updates**: Changes when you add/remove status labels

### Manual Sync (If Needed)

**Option A: Via GitHub CLI**
```bash
# If workflows are on dev branch:
gh workflow run .github/workflows/sync-sprint-status.yml --ref dev

# Or use workflow name (once merged to main):
gh workflow run "Sync Sprint Status to GitHub Projects"
```

**Option B: Via GitHub UI**
- Go to: https://github.com/jerryagenyi/ccip/actions
- Click "Sync Sprint Status to GitHub Projects"
- Click "Run workflow" → "Run workflow"

**Note:** 
- Workflows must be committed and pushed to GitHub first!
- If workflows are on `dev` branch, use: `gh workflow run .github/workflows/sync-sprint-status.yml --ref dev`
- For best results, merge workflows to `main` branch

### Workflow Files

Edit the workflows in `.github/workflows/`:
- `sync-sprint-status.yml` - Main sync logic
- `link-pr-to-story.yml` - PR linking
- `update-project-status.yml` - Label-based updates

## Alternative: Use GitHub Issues for Tracking

While project automation is disabled, you can use GitHub Issues effectively:

1. **Use Labels for Status:**
   - `status:backlog`, `status:in-progress`, `status:review`, `status:done`
   - Filter issues by label in Issues tab

2. **Use Milestones:**
   - Create milestones for sprints/releases
   - Assign issues to milestones
   - Track progress via milestone view

3. **Use Projects Manually:**
   - Update project dashboard weekly
   - Use it as a visual board, not real-time sync

## Best Practices

1. **Update project weekly:**
   - Review all items
   - Update statuses
   - Move completed items to "Done"

2. **Use consistent labels:**
   - Always use `status:*` labels
   - Use `epic:epic-XXX` for linking
   - Use `story` or `epic` labels

3. **Link PRs to issues:**
   - Use "Closes #123" in PR description
   - GitHub will auto-close issues on merge

4. **Keep project in sync:**
   - When you update `sprint-status.yaml`, manually update project
   - Or run the Python script: `python3 scripts/sync-to-github-projects.py`

## References

- **Setup Guide:** `docs/GITHUB_PROJECTS_SETUP.md` - Complete automation setup
- **Deployment Guide:** `docs/deployment/DEPLOYMENT_WORKFLOW.md` - About deploy.yml workflow
- Your Project: https://github.com/users/jerryagenyi/projects/2
- GitHub Projects Docs: https://docs.github.com/en/issues/planning-and-tracking-with-projects
- Workflow README: `.github/workflows/README.md`
- Sync Script: `scripts/sync-to-github-projects.py`

