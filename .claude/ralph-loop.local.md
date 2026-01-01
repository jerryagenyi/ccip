---
active: true
iteration: 1
max_iterations: 20
completion_promise: "RALPH-AUTH-COMPLETE"
started_at: "2025-12-28T00:00:00Z"
---

Check /bmad/bmm/workflows/workflow-status for current status and pending tasks. Priority: Implement full authentication workflow (login, logout, registration, forgotten password, change password) working 100% locally and remotely at https://ccip.jerryagenyi.xyz/auth/login.

Switch to dev branch.

Create feature branch 'feature/full-auth'.

Create detailed task list including E2E Playwright tests for entire auth flow.

Implement all auth features with unit and E2E tests.

Run npm run dev locally and verify all functionality via browser/Playwright.

Ensure ALL tests pass (unit + E2E) and auth works perfectly locally.

ONLY after 100% local success: Push feature branch to dev, test npm run dev on dev.

Wait for human approval on dev.

ONLY after approval: Merge dev to main.

Do NOT claim completion or exit until:

All E2E tests pass 100%

Local npm run dev auth flow works perfectly (test each endpoint)

Dev branch deployed and verified working

Human approval received

Successfully merged to main

Output exactly: RALPH-AUTH-COMPLETE at the very end only when ALL criteria met.
