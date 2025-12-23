# E2E Test Fixing Plan

**Status:** Ready for implementation
**Created:** 2025-12-23
**Priority:** CRITICAL - E2E tests are essential for production confidence

---

## Executive Summary

The E2E tests are currently **skipped in CI** due to Vue app mounting issues when using the production build served locally. The tests take 56+ minutes and result in 74 failures out of 108 tests. This plan outlines the steps to get E2E tests working reliably in CI.

### Current State

| Component | Status |
|-----------|--------|
| Backend PHPUnit Tests | ✅ 43/43 passing |
| Frontend Unit Tests | ✅ Passing |
| Security Scan | ✅ Passing |
| **E2E Tests** | ⚠️ **SKIPPED** (needs fix) |

---

## Problem Analysis

### Root Causes Identified

1. **Test File Proliferation:** 13 different auth test files (many are duplicates/iterations)
2. **Environment Confusion:** Tests designed for production URLs but running against local CI services
3. **Production Build Issues:** Vue app not mounting properly when serving `dist/` folder locally
4. **Hardcoded URLs:** `auth-production.spec.ts` uses hardcoded production URLs
5. **Hydration Failures:** `hydration.hasRoot` is `false` - Vue app not mounting at all
6. **Base URL Mismatch:** Tests expecting hash-based routing (`/#/auth/login`) vs Vue Router history mode
7. **Missing Test Data:** No seeded database state for E2E tests in CI
8. **Configuration Conflicts:** Vite `VITE_` variables embedded at build time vs runtime environment

### Test Files Inventory

```
frontend/tests/e2e/
├── auth.spec.ts                 # Standard auth tests (local)
├── auth-production.spec.ts       # Production URL tests
├── auth-ci-suite.spec.ts         # CI-specific comprehensive tests
├── auth-complete.spec.ts         # Another complete auth test suite
├── auth-final.spec.ts            # "Final" version (iteration)
├── auth-final-working.spec.ts    # "Working" version (iteration)
├── auth-final-validation.spec.ts # "Validation" version (iteration)
├── auth-flow.spec.ts             # Flow tests
├── auth-flows-bmad.spec.ts       # BMAD flow tests
├── debug.spec.ts                 # Debug tests
├── vue-debug.spec.ts             # Vue debug tests
├── vue-mount-fix.spec.ts         # Mount fix tests
└── vue-working.spec.ts           # Vue working tests
```

**Action:** Consolidate to 2-3 focused test files (CI, Local, Production smoke)

---

## Solution Strategy

### Phase 1: Test Suite Cleanup (Day 1)

**Goal:** Reduce test file clutter and eliminate redundancy

**Steps:**

1. **Delete Redundant Test Files:**
   - Remove: `debug.spec.ts`, `vue-debug.spec.ts`, `vue-mount-fix.spec.ts`, `vue-working.spec.ts`
   - Archive: `auth-final*.spec.ts`, `auth-complete.spec.ts` (move to `tests/e2e/_archive/`)

2. **Keep These Active Test Files:**
   - `auth-ci-suite.spec.ts` - Main CI test suite
   - `auth.spec.ts` - Local development tests
   - `auth-production.spec.ts` - Production smoke tests (manual run only)

3. **Update Playwright Config:**
   - Remove archived files from test run
   - Set appropriate timeouts
   - Configure separate projects for CI vs local

### Phase 2: CI Environment Configuration (Day 1-2)

**Goal:** Configure CI to run E2E tests against local services

**Problem:** Current CI tries to use production build served locally, but Vue app doesn't mount.

**Solution:** Use development mode in CI (not production build)

**Changes to `.github/workflows/ci.yml`:**

```yaml
e2e-tests:
  # ... existing setup ...

  - name: Start backend server
    working-directory: backend
    run: php artisan serve --host=0.0.0.0 --port=8000 &

  - name: Start frontend dev server
    working-directory: frontend
    run: npm run dev -- --host 0.0.0.0 --port 5173 &
    # Use dev server, NOT production build

  - name: Wait for services to be ready
    run: |
      for i in {1..30}; do
        if curl -s http://localhost:8000/api/v1/health > /dev/null; then
          echo "Backend is ready"
          break
        fi
        sleep 2
      done

      for i in {1..30}; do
        if curl -s http://localhost:5173 > /dev/null; then
          echo "Frontend is ready"
          break
        fi
        sleep 2
      done

  - name: Seed test database
    working-directory: backend
    run: |
      php artisan db:seed --class=OrganisationSeeder
      php artisan db:seed --class=UserSeeder
      php artisan db:seed --class=ReportTemplateSeeder
      php artisan db:seed --class=HelpArticleSeeder

  - name: Run E2E tests
    working-directory: frontend
    env:
      BASE_URL: http://localhost:5173
      VITE_API_URL: http://localhost:8000/api
    run: npx playwright test --project=chromium --reporter=list
```

### Phase 3: Fix Test Files (Day 2-3)

**Goal:** Update tests to work with CI environment

**3.1 Update `playwright.config.ts`:**

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,  // Run sequentially for stability
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  timeout: 60 * 1000,
  expect: {
    timeout: 15 * 1000,
  },

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list']
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Only use webServer for local development, not CI
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
```

**3.2 Create `tests/e2e/fixtures/auth.fixture.ts`:**

```typescript
import { test as base } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Set auth token before test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('auth_user', JSON.stringify({
        id: 1,
        email: 'admin@ccip.local',
        name: 'Test Admin',
        role: 'admin'
      }));
    });
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

**3.3 Update Test Selectors:**

Current issue: Tests using wrong selectors (e.g., `#root` instead of `#q-app`)

Fix in `auth-ci-suite.spec.ts`:

```typescript
test('Vue app is properly hydrated', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Wait for Quasar app to mount
  await page.waitForSelector('#q-app', { timeout: 10000 });

  const hydration = await page.evaluate(() => ({
    hasQuasarApp: !!document.querySelector('#q-app'),
    quasarComponents: document.querySelectorAll('[class*="q-"]').length,
    bodyContent: document.body.textContent?.substring(0, 100),
  }));

  expect(hydration.hasQuasarApp).toBe(true);
  expect(hydration.quasarComponents).toBeGreaterThan(0);
});
```

### Phase 4: Fix Routing and Navigation (Day 3)

**Problem:** Tests using hash-based routing (`/#/auth/login`) but app uses history mode

**Fix:**

Update test navigation to match Vue Router history mode:

```typescript
// Before:
await page.goto('/#/auth/login');

// After:
await page.goto('/auth/login');
```

Or detect routing mode:

```typescript
const getAuthUrl = (path: string) => {
  return process.env.HASH_ROUTING === 'true' ? `/#/${path}` : `/${path}`;
};

await page.goto(getAuthUrl('auth/login'));
```

### Phase 5: Add Test Data Management (Day 4)

**Problem:** No seeded test data in CI for E2E tests

**Solution:** Create dedicated test seeder

**Create `backend/database/seeders/E2ETestSeeder.php`:**

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class E2ETestSeeder extends Seeder
{
    public function run(): void
    {
        // Create test organisation
        \App\Models\Organisation::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'Test Organisation',
                'email' => 'test@ccip.local',
                'phone_number' => '+1234567890',
                'address' => '123 Test Street',
                'country' => 'Test Country',
                'region' => 'Test Region',
                'district' => 'Test District',
            ]
        );

        // Create test admin user
        \App\Models\User::firstOrCreate(
            ['email' => 'admin@ccip.local'],
            [
                'name' => 'E2E Test Admin',
                'password' => Hash::make('password'),
                'organisation_id' => 1,
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        // Create test regular user
        \App\Models\User::firstOrCreate(
            ['email' => 'user@ccip.local'],
            [
                'name' => 'E2E Test User',
                'password' => Hash::make('password'),
                'organisation_id' => 1,
                'role' => 'user',
                'is_active' => true,
            ]
        );
    }
}
```

**Update CI workflow to use E2E seeder:**

```yaml
- name: Seed E2E test database
  working-directory: backend
  run: php artisan db:seed --class=E2ETestSeeder
```

### Phase 6: API Mocking for Isolated Tests (Day 4-5)

**Problem:** Some tests shouldn't require full backend

**Solution:** Add API mocking capabilities

**Create `tests/e2e/helpers/api-mock.ts`:**

```typescript
export async function mockAuthAPI(page: Page, scenario: 'success' | 'failure' | 'error') {
  await page.route('**/api/v1/auth/login', async route => {
    switch (scenario) {
      case 'success':
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Login successful',
            data: {
              user: {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                role: 'user'
              },
              token: 'mock-jwt-token'
            }
          })
        });
        break;
      case 'failure':
        await route.fulfill({
          status: 422,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            message: 'Invalid credentials',
            errors: {
              email: ['The provided credentials are incorrect.']
            }
          })
        });
        break;
      case 'error':
        await route.abort('failed');
        break;
    }
  });
}
```

---

## Implementation Checklist

### Week 1: Foundation

- [ ] **Day 1:**
  - [ ] Archive redundant test files
  - [ ] Update `playwright.config.ts`
  - [ ] Modify CI workflow to use dev server instead of production build
  - [ ] Test basic Vue app mounting

- [ ] **Day 2:**
  - [ ] Create `E2ETestSeeder.php`
  - [ ] Update CI workflow to seed test database
  - [ ] Fix test selectors (`#q-app` instead of `#root`)
  - [ ] Run initial CI test

- [ ] **Day 3:**
  - [ ] Fix routing (history mode vs hash mode)
  - [ ] Update all navigation calls in tests
  - [ ] Add proper wait conditions for Vue hydration
  - [ ] Run CI test and analyze failures

- [ ] **Day 4:**
  - [ ] Create API mocking helpers
  - [ ] Add fixtures for authenticated state
  - [ ] Update tests to use fixtures
  - [ ] Run CI test

- [ ] **Day 5:**
  - [ ] Review and fix any remaining test failures
  - [ ] Optimize test execution time
  - [ ] Add test reporting improvements
  - [ ] Final CI validation

### Week 2: Hardening (if needed)

- [ ] Add visual regression tests
- [ ] Add accessibility tests
- [ ] Add performance benchmarks
- [ ] Document test patterns

---

## Expected Outcomes

### Success Criteria

1. ✅ E2E tests run in CI without manual intervention
2. ✅ All critical auth flows tested (login, registration, password reset)
3. ✅ Test execution time under 15 minutes
4. ✅ Zero flaky tests (consistent results)
5. ✅ Clear test reports with actionable failure information

### Metrics to Track

| Metric | Current | Target |
|--------|---------|--------|
| Test Execution Time | 56+ min (failing) | < 15 min |
| Pass Rate | 34/108 (31%) | 100% |
| Flakiness | High | 0% |
| Maintenance Burden | 13 test files | 2-3 test files |

---

## Fallback Options

If the above approach doesn't work:

1. **Use Docker Compose for E2E:**
   - Run full stack in Docker for tests
   - More consistent environment
   - Adds complexity to CI

2. **Use Staging Environment:**
   - Deploy to staging before running E2E
   - Tests against production-like environment
   - Slower feedback loop

3. **Mock Everything:**
   - Mock all API responses
   - Tests only frontend code
   - Loses integration testing value

4. **Reduce Test Scope:**
   - Only test happy path critical flows
   - Run comprehensive E2E locally before releases
   - Faster CI, less coverage

---

## Files to Modify

### Must Modify:

1. `.github/workflows/ci.yml` - E2E job configuration
2. `frontend/playwright.config.ts` - Test configuration
3. `frontend/tests/e2e/auth-ci-suite.spec.ts` - Main test file
4. `backend/database/seeders/E2ETestSeeder.php` - New file

### Should Modify:

5. `frontend/tests/e2e/auth.spec.ts` - Update selectors
6. `frontend/.env.example` - Update E2E defaults
7. `frontend/package.json` - Add test scripts

### May Create:

8. `frontend/tests/e2e/fixtures/auth.fixture.ts` - Auth fixtures
9. `frontend/tests/e2e/helpers/api-mock.ts` - API mocking
10. `frontend/tests/e2e/_archive/` - Archive old test files

---

## Notes for Future Implementation

1. **Parallel Execution:** Once stable, enable parallel execution for faster runs
2. **Visual Regression:** Consider adding Percy or Chromatic for visual tests
3. **Accessibility:** Add axe-core for a11y testing
4. **API Coverage:** Track which API endpoints are tested by E2E
5. **Test Data:** Consider using factory pattern instead of static seeder
6. **CI Caching:** Cache Playwright browsers for faster startup

---

## References

- **Playwright Docs:** https://playwright.dev/
- **Quasar Testing:** https://quasar.dev/testing/unit-testing
- **Vue Router:** https://router.vuejs.org/
- **Laravel Testing:** https://laravel.com/docs/testing

---

**Next Steps:**
1. Review and approve this plan
2. Start with Phase 1 (Test Suite Cleanup)
3. Commit changes incrementally
4. Run CI after each phase to validate progress
5. Adjust plan based on findings
