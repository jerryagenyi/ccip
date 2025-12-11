# Branch Protection Rules

This document outlines the recommended branch protection settings for the CCIP repository.

## Branch Strategy

```
main (production)
  ↑ PR with required checks
dev (development)
  ↑ feature branches
feature/*, fix/*, etc.
```

## Recommended GitHub Settings

### Main Branch Protection

Go to: **Settings → Branches → Add branch protection rule**

**Branch name pattern:** `main`

- [x] **Require a pull request before merging**
  - [x] Require approvals: 1 (or more for team projects)
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [x] Require review from Code Owners (optional)

- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - Required status checks:
    - `Backend Tests`
    - `Frontend Tests`
    - `E2E Tests`
    - `Security Scan` (optional)

- [x] **Require conversation resolution before merging**

- [x] **Do not allow bypassing the above settings**

- [ ] **Allow force pushes** (keep unchecked)

- [ ] **Allow deletions** (keep unchecked)

### Dev Branch Protection (Optional)

**Branch name pattern:** `dev`

- [x] **Require a pull request before merging** (optional for solo dev)
- [x] **Require status checks to pass before merging**
  - Required status checks:
    - `Backend Tests`
    - `Frontend Tests`

## Workflow

### For Features/Fixes

```bash
# Create feature branch from dev
git checkout dev
git pull origin dev
git checkout -b feature/my-feature

# Work on feature...
git add .
git commit -m "feat: add new feature"

# Push and create PR to dev
git push -u origin feature/my-feature
# Create PR: feature/my-feature → dev
```

### Merging to Main (Production)

```bash
# Ensure dev is up to date
git checkout dev
git pull origin dev

# Create PR: dev → main
# This triggers full CI pipeline including E2E tests
# After approval and checks pass, merge
```

## CI/CD Pipeline Summary

| Trigger | Workflow | Jobs |
|---------|----------|------|
| PR to `main` | CI Pipeline | Backend tests, Frontend tests, E2E tests, Security scan |
| Push to `dev` | CI Pipeline | Backend tests, Frontend tests |
| Merge to `main` | Deploy | Build images, Deploy to Dokploy |

## Quick Reference Commands

```bash
# Check current branch
git branch

# Switch to dev
git checkout dev

# Create feature branch
git checkout -b feature/my-feature

# Push feature branch
git push -u origin feature/my-feature

# Update dev from main (after production release)
git checkout dev
git merge main
git push origin dev
```

