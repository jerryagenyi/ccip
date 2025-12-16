# GitHub Projects Integration Guide

## Overview

BMAD Method currently uses `file-system` tracking (`sprint-status.yaml`), but you can integrate with GitHub Projects by syncing epics and stories to GitHub Issues and tracking them in a GitHub Project.

## How GitHub Projects Works

GitHub Projects (v2) can track:
- **Issues** - Each epic/story becomes an issue
- **Pull Requests** - Linked to issues automatically
- **Drafts** - For planning items
- **Custom Fields** - Status, Priority, Epic, etc.
- **Automation** - Auto-move items based on labels/status

## Integration Strategy

### Option 1: Manual Sync (Recommended for Start)

**Workflow:**
1. Create GitHub Issues for each epic and story
2. Create a GitHub Project board
3. Add issues to the project
4. Manually sync status between `sprint-status.yaml` and GitHub Projects

**Pros:**
- Simple to set up
- Full control
- No automation complexity

**Cons:**
- Manual sync required
- Can get out of sync

### Option 2: GitHub Actions Automation (Advanced)

**Workflow:**
1. Create GitHub Issues from `sprint-status.yaml` (one-time script)
2. Use GitHub Actions to sync status changes
3. Update `sprint-status.yaml` when issues change status

**Pros:**
- Automated sync
- Single source of truth (GitHub Projects)
- Team visibility

**Cons:**
- Requires GitHub Actions setup
- More complex

## Recommended Approach: Hybrid

**Use GitHub Projects for visibility, keep `sprint-status.yaml` as source of truth**

1. **Create Issues from Stories:**
   - One-time: Create GitHub Issues for all epics and stories
   - Link stories to epic issues (using issue references)
   - Add labels: `epic-001`, `story`, `epic`, etc.

2. **Create GitHub Project:**
   - Add all issues to project
   - Create custom fields: `Epic`, `Story ID`, `Status`
   - Set up columns: Backlog, Drafted, Ready for Dev, In Progress, Review, Done

3. **Sync Workflow:**
   - When moving story to `ready-for-dev` in `sprint-status.yaml`:
     - Also update GitHub Issue status in Projects
   - When Dev completes story:
     - Update both `sprint-status.yaml` and GitHub Issue
   - Use GitHub Projects for team visibility
   - Use `sprint-status.yaml` for BMAD workflow automation

## Step-by-Step Setup

### Step 1: Create GitHub Issues

**For Each Epic:**
- Title: `Epic 001: User & Organisation Management`
- Body: Copy from `docs/epics/epic-001-user-organisation-management.md`
- Labels: `epic`, `epic-001`
- Type: Issue (or Draft if using drafts)

**For Each Story:**
- Title: `US-001: User Registration & Authentication`
- Body: Copy from `docs/stories/US-001-user-registration-authentication.md`
- Labels: `story`, `epic-001`
- Link to Epic: Add `Epic: #<epic-issue-number>` in body

### Step 2: Create GitHub Project

1. Go to your repository → Projects → New Project
2. Choose "Board" layout
3. Add custom fields:
   - **Epic** (text) - e.g., "Epic 001"
   - **Story ID** (text) - e.g., "US-001"
   - **Status** (single select) - backlog, drafted, ready-for-dev, in-progress, review, done
   - **Priority** (single select) - High, Medium, Low

4. Create columns:
   - **Backlog** - Status: backlog
   - **Drafted** - Status: drafted
   - **Ready for Dev** - Status: ready-for-dev
   - **In Progress** - Status: in-progress
   - **Review** - Status: review
   - **Done** - Status: done

5. Add all issues to the project

### Step 3: Set Up Automation (Optional)

**GitHub Actions Workflow** (`.github/workflows/sync-sprint-status.yml`):

```yaml
name: Sync Sprint Status to GitHub Projects

on:
  workflow_dispatch:
  schedule:
    - cron: '0 9 * * *' # Daily at 9 AM

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Read sprint-status.yaml
        # Parse YAML and update GitHub Issues/Projects
        # This would require a custom script
```

## Mapping BMAD Status to GitHub Projects

| BMAD Status | GitHub Projects Status | GitHub Issue Labels |
|-------------|----------------------|-------------------|
| `backlog` | Backlog | `status:backlog` |
| `drafted` | Drafted | `status:drafted` |
| `ready-for-dev` | Ready for Dev | `status:ready-for-dev` |
| `in-progress` | In Progress | `status:in-progress` |
| `review` | Review | `status:review` |
| `done` | Done | `status:done` |

## Current BMAD Limitation

BMAD currently only supports `file-system` tracking. The workflow mentions future support for Jira, Linear, Trello via MCP, but GitHub Projects isn't explicitly supported yet.

**Workaround:** Use GitHub Issues as the bridge between `sprint-status.yaml` and GitHub Projects.

## Recommended Workflow

1. **Keep `sprint-status.yaml` as source of truth** for BMAD workflows
2. **Create GitHub Issues** for team visibility and project management
3. **Sync manually** when status changes (or automate with GitHub Actions)
4. **Use GitHub Projects** for:
   - Team visibility
   - Sprint planning meetings
   - Progress tracking
   - Reporting

5. **Use `sprint-status.yaml`** for:
   - BMAD workflow automation
   - Dev agent story discovery
   - Status tracking in code

## Quick Start Script

I can create a script to:
1. Read `sprint-status.yaml`
2. Create GitHub Issues for all epics and stories
3. Link them properly
4. Add them to a GitHub Project

Would you like me to create this script?

---

**Note:** This is a manual integration approach. Future BMAD versions may support GitHub Projects natively via MCP (Model Context Protocol).
