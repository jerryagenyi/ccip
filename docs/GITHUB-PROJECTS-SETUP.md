# GitHub Projects Setup Guide for CCIP

## Quick Answer

**Yes, you can connect `sprint-status.yaml` to GitHub Projects!** Here's how:

## Integration Approach

### Current BMAD Status
- BMAD currently uses `file-system` tracking (`sprint-status.yaml`)
- Future versions will support Jira, Linear, Trello via MCP
- GitHub Projects integration isn't built-in yet, but we can sync via GitHub Issues

### Recommended Workflow

**Hybrid Approach:**
1. **Keep `sprint-status.yaml` as source of truth** for BMAD workflows
2. **Create GitHub Issues** for epics and stories (one-time setup)
3. **Add Issues to GitHub Project** for team visibility
4. **Sync status manually** (or automate with GitHub Actions)

## Step-by-Step Setup

### Step 1: Create GitHub Issues

**Option A: Manual (Recommended for Start)**

1. Go to your repository: https://github.com/jerryagenyi/ccip/issues
2. For each epic, create an issue:
   - Title: `Epic 001: User & Organisation Management`
   - Body: Copy content from `docs/epics/epic-001-user-organisation-management.md`
   - Labels: `epic`, `epic-001`
3. For each story, create an issue:
   - Title: `US-001: User Registration & Authentication`
   - Body: Copy content from `docs/stories/US-001-user-registration-authentication.md`
   - Labels: `story`, `epic-001`, `status:drafted`
   - Link to Epic: Add `Epic: #<epic-issue-number>` in body

**Option B: Automated Script**

I've created a Python script (`scripts/sync-to-github-projects.py`) that can:
- Read `sprint-status.yaml`
- Create GitHub Issues automatically
- Link stories to epics
- Add appropriate labels

**To use the script:**
```bash
# Install dependencies
pip install pyyaml requests

# Set GitHub token
export GITHUB_TOKEN=your_personal_access_token

# Run script
python scripts/sync-to-github-projects.py
```

### Step 2: Create GitHub Project

1. **Go to Projects:** https://github.com/jerryagenyi/ccip/projects
2. **Click "New Project"**
3. **Choose "Board" layout**
4. **Add Custom Fields:**
   - **Epic** (text field) - e.g., "Epic 001"
   - **Story ID** (text field) - e.g., "US-001"
   - **Status** (single select) - backlog, drafted, ready-for-dev, in-progress, review, done
   - **Priority** (single select) - High, Medium, Low

5. **Create Columns:**
   - **Backlog** - Filter: `status:backlog`
   - **Drafted** - Filter: `status:drafted`
   - **Ready for Dev** - Filter: `status:ready-for-dev`
   - **In Progress** - Filter: `status:in-progress`
   - **Review** - Filter: `status:review`
   - **Done** - Filter: `status:done`

6. **Add Issues to Project:**
   - Click "Add item" → Select all epic and story issues
   - Issues will appear in columns based on their `status:` label

### Step 3: Set Up Automation (Optional)

**GitHub Projects Automation:**
- When issue label changes to `status:ready-for-dev` → Move to "Ready for Dev" column
- When issue label changes to `status:in-progress` → Move to "In Progress" column
- When issue label changes to `status:done` → Move to "Done" column

**GitHub Actions Workflow** (for bidirectional sync):

Create `.github/workflows/sync-sprint-status.yml`:

```yaml
name: Sync Sprint Status

on:
  workflow_dispatch:
  issues:
    types: [labeled, closed, reopened]

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update sprint-status.yaml
        run: |
          # Parse issue event
          # Update sprint-status.yaml based on label changes
          # Commit changes back to repo
```

## Status Mapping

| BMAD Status (sprint-status.yaml) | GitHub Issue Label | GitHub Project Column |
|----------------------------------|-------------------|----------------------|
| `backlog` | `status:backlog` | Backlog |
| `drafted` | `status:drafted` | Drafted |
| `ready-for-dev` | `status:ready-for-dev` | Ready for Dev |
| `in-progress` | `status:in-progress` | In Progress |
| `review` | `status:review` | Review |
| `done` | `status:done` | Done |

## Workflow: Moving Story to `ready-for-dev`

**Current BMAD Way:**
1. Edit `docs/sprint-artifacts/sprint-status.yaml`
2. Change `US-001-user-registration-authentication: drafted` to `ready-for-dev`

**With GitHub Projects:**
1. Edit `docs/sprint-artifacts/sprint-status.yaml` (BMAD workflow still uses this)
2. **Also** update GitHub Issue:
   - Go to issue #X
   - Remove label `status:drafted`
   - Add label `status:ready-for-dev`
   - Issue automatically moves to "Ready for Dev" column in Project

## Benefits of GitHub Projects Integration

✅ **Team Visibility:** Everyone can see sprint progress  
✅ **Visual Tracking:** Kanban board view  
✅ **Reporting:** Built-in progress reports  
✅ **Integration:** Links to PRs automatically  
✅ **Automation:** Can automate status transitions  

## Limitations

⚠️ **BMAD workflows still use `sprint-status.yaml`** - This remains the source of truth for BMAD agents  
⚠️ **Manual sync required** (unless you automate with GitHub Actions)  
⚠️ **Two sources of truth** - Need to keep both in sync  

## Recommended Approach

**For Now:**
1. Use GitHub Projects for **team visibility and planning**
2. Keep `sprint-status.yaml` as **source of truth for BMAD workflows**
3. Sync manually when status changes (takes 30 seconds)
4. Consider automating later with GitHub Actions

**Future:**
- BMAD may add native GitHub Projects support via MCP
- Until then, this hybrid approach works well

---

**Would you like me to:**
1. Create the GitHub Issues automatically using the script?
2. Set up a GitHub Actions workflow for automatic sync?
3. Create a more detailed integration guide?
