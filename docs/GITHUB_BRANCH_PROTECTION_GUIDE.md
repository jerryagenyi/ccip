# GitHub Branch Protection Rules - Detailed Setup Guide

## Overview

This guide provides step-by-step instructions for setting up branch protection rules for the `main` branch in your CCIP repository, based on your current CI/CD setup.

## Accessing Branch Protection Settings

1. Go to your repository: https://github.com/jerryagenyi/ccip
2. Click **Settings** (top navigation)
3. In the left sidebar, under **Code and automation**, click **Rulesets**
4. Click **Protect Main Branch** (or create a new ruleset)

## Step-by-Step Configuration

### 1. Ruleset Name & Enforcement

**Ruleset Name:**
- Enter: `Protect Main Branch`

**Enforcement Status:**
- Select: **Active** (not "Disabled")
- This enables the protection rules

### 2. Bypass List (Optional but Recommended)

**Purpose:** Allow certain roles/teams to bypass rules when needed

**Configuration:**
- Click **"+ Add bypass"**
- Add yourself (as repository owner/admin)
- **Why:** You may need to push hotfixes or emergency changes directly to main

**Recommendation:** 
- Add yourself and any other admins
- Don't add everyone - defeats the purpose of protection

### 3. Target Branches

**Question:** "Which branches should be matched?"

**Configuration:**
- Click **"+ Default"** (or **"+ Add target"**)
- Select: **Branch name pattern**
- Enter: `main`
- Click **Add**

**Result:** Should show "Applies to 1 target: `main`"

### 4. Rules Configuration

This is the most important section. Configure each rule based on your needs:

#### ✅ **Essential Rules (Enable These)**

**A. Restrict creations**
- **Checkbox:** ✅ Enable
- **Purpose:** Prevents creating new branches matching `main` pattern
- **Why:** Ensures all work happens on feature branches

**B. Restrict updates**
- **Checkbox:** ✅ Enable
- **Purpose:** Prevents direct pushes to `main`
- **Why:** Forces all changes through pull requests

**C. Restrict deletions**
- **Checkbox:** ✅ Enable
- **Purpose:** Prevents deletion of `main` branch
- **Why:** Protects your primary branch from accidental deletion

**D. Require a pull request before merging**
- **Checkbox:** ✅ Enable
- **Purpose:** All changes must go through PRs
- **Additional Settings (Click "Show additional settings"):**
  - **Required approvals:** `1` (minimum)
  - **✅ Dismiss stale PR approvals when new commits are pushed**
  - **✅ Require review from CODEOWNERS:** Optional (if you create CODEOWNERS file)
  - **✅ Require last push approval:** Optional (prevents self-approval)

**E. Block force pushes**
- **Checkbox:** ✅ Enable
- **Purpose:** Prevents force pushes that can overwrite history
- **Why:** Protects git history integrity

#### ⚠️ **Optional Rules (Consider These)**

**F. Require status checks to pass**
- **Checkbox:** ⚠️ Enable (after verifying CI names)
- **Purpose:** Blocks merge if CI tests fail
- **Configuration:**
  - **✅ Require branches to be up to date before merging**
  - **Required status checks:** Add these (must match exactly):
    - `Backend Tests` (from `ci.yml` job name)
    - `Frontend Tests` (from `ci.yml` job name)
    - `E2E Tests` (from `ci.yml` job name)
  
  **⚠️ Important:** 
  - Status check names must match exactly what your CI workflow produces
  - You'll need to run a test PR first to see the exact names
  - Common names: `test (backend)`, `test (frontend)`, `test (e2e)`, or job names like `Backend Tests`

**G. Require conversation resolution before merging**
- **Checkbox:** ✅ Enable (recommended)
- **Purpose:** All PR comments must be resolved before merge
- **Why:** Ensures code review feedback is addressed

**H. Require deployments to succeed**
- **Checkbox:** ❌ Skip (for now)
- **Why:** Dokploy handles deployment separately, not through GitHub Actions
- **Note:** You can enable this later if you add deployment status checks

#### ❌ **Rules to Skip (For Now)**

**I. Require linear history**
- **Checkbox:** ❌ Disable
- **Why:** Allows merge commits, which is fine for your workflow
- **Note:** Enable if you want to enforce rebase-only workflow

**J. Require signed commits**
- **Checkbox:** ❌ Disable
- **Why:** Adds complexity without significant benefit for solo/small team
- **Note:** Enable later if you need compliance/audit requirements

**K. Require code scanning results**
- **Checkbox:** ❌ Disable (for now)
- **Why:** You have security scanning, but it's not blocking
- **Note:** Enable later when you want to enforce security checks

**L. Require code quality results**
- **Checkbox:** ❌ Disable (for now)
- **Why:** Not yet configured
- **Note:** Enable when you add code quality tools (SonarQube, CodeClimate, etc.)

**M. Automatically request Copilot code review**
- **Checkbox:** ⚠️ Optional
- **Why:** Nice-to-have, but not essential
- **Note:** Enable if you have Copilot and want automated reviews

**N. Manage static analysis tools in Copilot code review**
- **Checkbox:** ❌ Skip (Preview feature)
- **Why:** Still in preview, may be unstable

### 5. Save Configuration

1. Review all settings
2. Click **"Save changes"** (green button at bottom)
3. If you made mistakes, click **"Revert changes"** to undo

## Recommended Configuration Summary

Based on your current setup, here's the recommended configuration:

### ✅ **Enable These Rules:**

1. ✅ **Restrict creations**
2. ✅ **Restrict updates**
3. ✅ **Restrict deletions**
4. ✅ **Require a pull request before merging**
   - Required approvals: 1
   - ✅ Dismiss stale PR approvals
5. ✅ **Block force pushes**
6. ✅ **Require conversation resolution before merging**
7. ⚠️ **Require status checks to pass** (after verifying CI names)
   - ✅ Require branches to be up to date
   - Required checks: `Backend Tests`, `Frontend Tests`, `E2E Tests`

### ❌ **Disable These Rules:**

1. ❌ Require linear history
2. ❌ Require signed commits
3. ❌ Require deployments to succeed (Dokploy handles this)
4. ❌ Require code scanning results (for now)
5. ❌ Require code quality results (for now)

## Finding Your Exact CI Status Check Names

Before enabling "Require status checks to pass", you need to know the exact names:

### Method 1: Check a Recent PR
1. Open any recent PR that had CI run
2. Scroll to the bottom, look at the "Checks" section
3. Note the exact job names (e.g., "Backend Tests", "Frontend Tests")

### Method 2: Check Workflow File
Look at `.github/workflows/ci.yml`:
- Job names are in the `name:` field of each job
- Your jobs: `Backend Tests`, `Frontend Tests`, `E2E Tests`

### Method 3: Create a Test PR
1. Create a test branch: `git checkout -b test-branch-protection`
2. Make a small change
3. Push and create PR
4. Wait for CI to run
5. Check the status check names in the PR

## Testing Your Branch Protection

After setup, test it:

1. **Create a test branch:**
   ```bash
   git checkout -b test-protection
   ```

2. **Make a small change:**
   ```bash
   echo "# Test" >> README.md
   git add README.md
   git commit -m "Test branch protection"
   git push origin test-protection
   ```

3. **Try to push directly to main (should fail):**
   ```bash
   git checkout main
   git merge test-protection
   git push origin main
   # Should be blocked!
   ```

4. **Create a PR instead (should work):**
   - Go to GitHub
   - Create PR from `test-protection` to `main`
   - Verify CI runs
   - Try to merge without approval (should be blocked)
   - Approve the PR
   - Merge should work

## Troubleshooting

### "Status checks not found"
- **Problem:** You enabled status checks but names don't match
- **Solution:** 
  1. Disable "Require status checks" temporarily
  2. Create a test PR and note the exact check names
  3. Re-enable and add the correct names

### "Can't push to main even as admin"
- **Problem:** Bypass list not configured
- **Solution:** Add yourself to the bypass list

### "PR can't be merged even with approval"
- **Problem:** Status checks failing or not configured
- **Solution:** 
  1. Check CI workflow is running
  2. Verify status check names match
  3. Ensure all required checks pass

### "Deployment not working"
- **Problem:** Dokploy not deploying
- **Solution:** 
  - Dokploy auto-deploys on push to main
  - Branch protection doesn't affect this
  - Check Dokploy dashboard for deployment status

## Dokploy Integration Note

**Important:** Your `deploy.yml` workflow is informational only. Dokploy handles actual deployment automatically when code is pushed to `main`. Branch protection rules won't interfere with Dokploy's auto-deployment.

**What happens:**
1. Code merged to `main` → Branch protection allows it (if rules pass)
2. Dokploy detects push → Starts auto-deployment
3. Services update → Zero downtime deployment

## Next Steps

1. **Set up branch protection** using this guide
2. **Test with a PR** to verify everything works
3. **Adjust rules** based on your team's needs
4. **Add more rules later** as your workflow matures

## References

- [GitHub Docs: About branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Docs: Requiring status checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule#require-status-checks-before-merging)
- Your CI workflow: `.github/workflows/ci.yml`
- Your deploy workflow: `.github/workflows/deploy.yml`

