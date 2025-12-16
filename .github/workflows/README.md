# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automating GitHub Projects integration.

## Workflows

### 1. `sync-sprint-status.yml`
**Purpose:** Syncs `sprint-status.yaml` to GitHub Projects

**Triggers:**
- Manual (workflow_dispatch)
- Daily at 9 AM UTC (schedule)
- When `sprint-status.yaml` is updated (push)

**What it does:**
1. Reads `docs/sprint-artifacts/sprint-status.yaml`
2. Finds corresponding GitHub Issues (by labels/titles)
3. Updates project item status based on YAML status
4. Maps status: `backlog` → Backlog, `drafted` → Drafted, etc.

**Usage:**
```bash
# Manual trigger
gh workflow run sync-sprint-status.yml

# Or via GitHub UI: Actions → Sync Sprint Status → Run workflow
```

### 2. `update-project-status.yml`
**Purpose:** Updates project status when issue labels change

**Triggers:**
- When issue is labeled/unlabeled
- Only runs for issues with `story` or `epic` labels

**What it does:**
1. Detects status label changes (e.g., `status:ready-for-dev`)
2. Finds the project item for that issue
3. Updates the Status field in the project
4. Maps labels to project status options

**Status Label Mapping:**
- `status:backlog` → Backlog
- `status:drafted` → Drafted
- `status:ready-for-dev` → Ready for Dev
- `status:in-progress` → In Progress
- `status:review` → Review
- `status:done` → Done

**Usage:**
Just add/remove status labels on issues - it happens automatically!

### 3. `link-pr-to-story.yml`
**Purpose:** Automatically links PRs to stories and adds them to the project

**Triggers:**
- When PR is opened, updated, or reopened

**What it does:**
1. Extracts story references from PR title/body (e.g., `US-001`)
2. Finds the corresponding GitHub Issue
3. Adds PR to GitHub Project
4. Sets PR status to "In Progress"
5. Links PR to story issue via comment

**Usage:**
Just mention a story in your PR (e.g., "Fixes US-001" or "Implements US-002") - it happens automatically!

## Setup Requirements

### 1. GitHub Token Permissions
The workflows use `secrets.GITHUB_TOKEN` which is automatically available. Ensure your repository has these permissions enabled:

- ✅ **Contents:** Read
- ✅ **Issues:** Read/Write
- ✅ **Pull Requests:** Read
- ✅ **Projects:** Write

### 2. Project Configuration
Your GitHub Project (https://github.com/users/jerryagenyi/projects/2) needs:

1. **Status Field** (Single Select) with these options:
   - Backlog
   - Drafted
   - Ready for Dev
   - In Progress
   - Review
   - Done

2. **Custom Fields** (optional but recommended):
   - Epic (Text)
   - Story ID (Text)
   - Priority (Single Select)

### 3. Issue Labels
Issues should have these labels:
- `epic` or `story` (to identify project items)
- `epic:epic-001` (to link stories to epics)
- `status:backlog`, `status:drafted`, etc. (for status tracking)

## Workflow Dependencies

These workflows work together:

```
sprint-status.yaml (source of truth)
    ↓
sync-sprint-status.yml (syncs to Projects)
    ↓
GitHub Projects
    ↑
update-project-status.yml (updates from labels)
    ↑
link-pr-to-story.yml (adds PRs automatically)
```

## Troubleshooting

### Workflow fails with "project not found"
- Check that PROJECT_NUMBER is correct (should be 2)
- Verify the project exists at: https://github.com/users/jerryagenyi/projects/2

### Status field not found
- Ensure your project has a "Status" field (case-sensitive)
- Check field options match exactly: "Backlog", "Drafted", "Ready for Dev", etc.

### Issues not found
- Ensure issues have `story` or `epic` labels
- Check that story references match (e.g., US-001 in title/labels)

### Permission errors
- Check repository settings → Actions → General
- Ensure "Read and write permissions" is enabled
- Verify workflow has `project: write` permission

## Testing

### Test sync workflow manually:
```bash
gh workflow run sync-sprint-status.yml
```

### Test status update:
1. Add label `status:ready-for-dev` to an issue
2. Check Actions tab for workflow run
3. Verify project status updated

### Test PR linking:
1. Create PR with "Fixes US-001" in title or body
2. Check Actions tab for workflow run
3. Verify PR added to project and linked to issue

## Next Steps

1. ✅ Workflows created
2. ⏳ Set up project fields (Status, Epic, Story ID)
3. ⏳ Create issues with proper labels
4. ⏳ Test workflows manually
5. ⏳ Enable built-in workflows in GitHub Projects UI

## Related Documentation

- [GitHub Projects Automation Guide](../docs/GITHUB-PROJECTS-AUTOMATION.md)
- [GitHub Projects Setup](../docs/GITHUB-PROJECTS-SETUP.md)
- [GitHub Projects Integration](../docs/GITHUB-PROJECTS-INTEGRATION.md)

