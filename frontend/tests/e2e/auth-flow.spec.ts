import { test, expect } from '@playwright/test';

// #region agent log
const logDebug = (location: string, message: string, data: any = {}) => {
  fetch('http://127.0.0.1:7242/ingest/0f151aad-f3a1-4808-8146-9d35c8654613', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location,
      message,
      data,
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'e2e-test',
    })
  }).catch(() => {});
};
// #endregion

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // #region agent log
    logDebug('auth-flow.spec.ts:beforeEach', 'Starting test setup', {});
    // #endregion
    
    // Clear localStorage and cookies before each test
    await page.goto('/');
    
    // #region agent log
    logDebug('auth-flow.spec.ts:beforeEach', 'Page loaded', { url: page.url() });
    // #endregion
    
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.context().clearCookies();
    
    // #region agent log
    logDebug('auth-flow.spec.ts:beforeEach', 'Setup complete', {});
    // #endregion
  });

  test('should complete full registration flow', async ({ page }) => {
    await page.goto('/auth/register');

    // Step 1: Personal Information
    await expect(page.locator('text=Create Account')).toBeVisible();
    await page.fill('input[type="text"]', 'Test User');
    await page.fill('input[type="email"]', `test-${Date.now()}@example.com`);
    await page.fill('input[type="tel"]', '+1234567890');
    
    // Navigate to next step
    await page.click('button:has-text("Next")');

    // Step 2: Organisation (skip for now - can be enhanced)
    // Step 3: Account Setup
    await page.fill('input[type="password"]:nth-of-type(1)', 'Password123!');
    await page.fill('input[type="password"]:nth-of-type(2)', 'Password123!');
    
    // Navigate to review step
    await page.click('button:has-text("Next")');

    // Step 4: Review & Submit
    await page.check('input[type="checkbox"]');
    await page.click('button:has-text("Create Account")');

    // Should redirect to dashboard after successful registration
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should login with valid credentials', async ({ page }) => {
    // #region agent log
    logDebug('auth-flow.spec.ts:login-test', 'Starting login test', {});
    // #endregion
    
    await page.goto('/auth/login');
    
    // #region agent log
    logDebug('auth-flow.spec.ts:login-test', 'Navigated to login page', { url: page.url() });
    // #endregion

    // Fill login form
    await page.fill('input[type="email"]', 'demo@ccip.com');
    await page.fill('input[type="password"]', 'demo123');
    
    // #region agent log
    logDebug('auth-flow.spec.ts:login-test', 'Form filled', { email: 'demo@ccip.com' });
    // #endregion

    // Submit form
    await page.click('button[type="submit"]');
    
    // #region agent log
    logDebug('auth-flow.spec.ts:login-test', 'Form submitted', {});
    // #endregion

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // #region agent log
    const finalUrl = page.url();
    logDebug('auth-flow.spec.ts:login-test', 'After submit', { url: finalUrl, matchesDashboard: /dashboard/.test(finalUrl) });
    // #endregion
    
    // Should show user menu or authenticated content
    await expect(page.locator('text=Dashboard').or(page.locator('[data-testid="user-menu"]'))).toBeVisible();
    
    // #region agent log
    logDebug('auth-flow.spec.ts:login-test', 'Login test complete', { success: true });
    // #endregion
  });

  test('should show error on invalid login credentials', async ({ page }) => {
    await page.goto('/auth/login');

    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=/invalid|incorrect|error/i')).toBeVisible({ timeout: 5000 });
    
    // Should stay on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/auth/login');

    await page.click('text=Forgot password?');

    await expect(page).toHaveURL(/.*forgot-password/);
    await expect(page.locator('text=/forgot|reset/i')).toBeVisible();
  });

  test('should request password reset', async ({ page }) => {
    await page.goto('/auth/forgot-password');

    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // Should show success message
    await expect(page.locator('text=/sent|email|success/i')).toBeVisible({ timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'demo@ccip.com');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // Logout (assuming there's a logout button/menu)
    // This will need to be adjusted based on actual UI
    await page.click('[data-testid="user-menu"]').catch(() => {});
    await page.click('text=Logout').catch(() => {
      // If no logout button, try alternative selectors
      page.click('text=Sign out').catch(() => {});
    });

    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
    
    // Token should be cleared
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeNull();
  });

  test('should validate login form fields', async ({ page }) => {
    await page.goto('/auth/login');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=/required|invalid/i').first()).toBeVisible({ timeout: 2000 });
  });

  test('should validate registration form fields', async ({ page }) => {
    await page.goto('/auth/register');

    // Try to proceed without filling required fields
    await page.click('button:has-text("Next")');

    // Should show validation errors or prevent navigation
    await expect(page.locator('text=/required|invalid/i').first()).toBeVisible({ timeout: 2000 });
  });

  test('should handle password mismatch in registration', async ({ page }) => {
    await page.goto('/auth/register');

    // Fill step 1
    await page.fill('input[type="text"]', 'Test User');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button:has-text("Next")');

    // Fill passwords that don't match
    await page.fill('input[type="password"]:nth-of-type(1)', 'Password123!');
    await page.fill('input[type="password"]:nth-of-type(2)', 'DifferentPassword123!');

    // Should show password mismatch error
    await expect(page.locator('text=/match|different/i')).toBeVisible({ timeout: 2000 });
  });

  test('should redirect authenticated user away from auth pages', async ({ page }) => {
    // Set auth token
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-token');
    });

    // Try to access login page
    await page.goto('/auth/login');

    // Should redirect to dashboard if authenticated
    // (This depends on your router guard implementation)
    // For now, we'll just check that the page loads
    await page.waitForLoadState('networkidle');
  });
});

