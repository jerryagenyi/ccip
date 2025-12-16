# GitHub Projects Sync Guide

## Quick Setup

Your project is already configured with automated workflows to sync sprint status with GitHub Projects.

### What's Already Configured

1. **Sync Sprint Status** - Updates GitHub Project from `docs/sprint-artifacts/sprint-status.yaml`
2. **Auto-Link PRs** - Links pull requests to user stories
3. **Update Status** - Updates project status when labels change

### Setup Steps

1. **Ensure your project has the right fields:**
   - Go to: https://github.com/users/jerryagenyi/projects/2/views/1
   - Add a `Status` field (Single Select) with these options:
     - **Backlog** - "Epic or story not yet started"
     - **Drafted** - "Story file created, awaiting approval"
     - **Ready for Dev** - "Story approved and ready for development"
     - **In Progress** - "This is actively being worked on"
     - **Review** - "Ready for code review"
     - **Done** - "This has been completed"

2. **Use status labels on issues/PRs:**
   - `status:backlog`, `status:ready-for-dev`, `status:in-progress`, etc.

3. **Manual sync (if needed):**
   
   **Option A: Via GitHub CLI** (after workflows are committed):
   ```bash
   gh workflow run "Sync Sprint Status to GitHub Projects"
   ```
   
   **Option B: Via GitHub UI:**
   - Go to: https://github.com/jerryagenyi/ccip/actions
   - Click "Sync Sprint Status to GitHub Projects"
   - Click "Run workflow" → "Run workflow"
   
   **Note:** Workflows must be committed and pushed to GitHub first!

### How It Works

- **Daily sync**: Runs automatically at 9 AM UTC
- **PR linking**: Auto-detects story IDs (US-XXX) in PRs
- **Status updates**: Changes when you add/remove status labels

### Need Changes?

Edit the workflows in `.github/workflows/`:
- `sync-sprint-status.yml` - Main sync logic
- `link-pr-to-story.yml` - PR linking
- `update-project-status.yml` - Label-based updates

---

*For detailed troubleshooting, see `.github/workflows/README.md`*