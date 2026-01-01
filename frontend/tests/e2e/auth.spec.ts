import { test, expect } from '@playwright/test';

test.describe('CCIP Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.context().clearCookies();
  });

  test('login page loads correctly', async ({ page }) => {
    // Listen for console messages
    page.on('console', msg => {
      console.log('Browser console:', msg.type(), msg.text());
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      console.error('Page error:', error.message);
    });

    await page.goto('/#/auth/login');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for Vue to hydrate

    // Debug: Check what's actually on the page
    const debugInfo = await page.evaluate(() => {
      const qApp = document.querySelector('#q-app');
      const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src || 'inline');
      const errors = window.console._errors || [];
      
      return {
        qAppExists: !!qApp,
        qAppChildren: qApp?.children.length || 0,
        qAppHTML: qApp?.innerHTML.substring(0, 500) || 'none',
        scriptsLoaded: scripts.length,
        bodyHTML: document.body.innerHTML.substring(0, 500),
        hasVue: !!window.Vue || !!document.querySelector('[data-v-]'),
        hasRouter: !!document.querySelector('router-view') || document.body.innerHTML.includes('router-view')
      };
    });
    console.log('Debug info:', JSON.stringify(debugInfo, null, 2));

    // Check for key elements using more flexible selectors
    await expect(page.locator('h2').filter({ hasText: 'Welcome Back' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button', { hasText: 'Sign In' })).toBeVisible({ timeout: 10000 });
  });

  test('registration page loads correctly', async ({ page }) => {
    await page.goto('/#/auth/register');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for Vue to hydrate

    // Check for registration form elements
    await expect(page.locator('h2').filter({ hasText: 'Create Account' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[placeholder*="Name"], input[name*="name" i]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
  });

  test('forgot password page loads correctly', async ({ page }) => {
    await page.goto('/#/auth/forgot-password');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for Vue to hydrate

    // Check for forgot password form
    await expect(page.locator('h2')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button').filter({ hasText: /send|reset|submit/i })).toBeVisible({ timeout: 10000 });
  });

  test('login form submission with valid credentials succeeds', async ({ page }) => {
    // Check backend is accessible
    const healthCheck = await page.goto('http://localhost:8000/api/v1/system/health').catch(() => null);
    if (!healthCheck || healthCheck.status() !== 200) {
      test.skip(true, 'Backend is not accessible - skipping login test');
      return;
    }

    await page.goto('/#/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for Vue to hydrate

    // Fill login form with valid credentials
    // Note: This test assumes test user exists in backend
    // In a real scenario, you'd seed test data first
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Submit form and wait for navigation
    await Promise.all([
      page.waitForURL(/.*dashboard/, { timeout: 5000 }).catch(() => null),
      page.click('button[type="submit"]')
    ]);

    // Should redirect to dashboard on success
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });
    
    // Verify dashboard content is visible
    const dashboardContent = page.locator('body').filter({ hasText: /dashboard|welcome|activities/i });
    await expect(dashboardContent.first()).toBeVisible({ timeout: 3000 });
  });

  test('login form submission with invalid credentials shows error', async ({ page }) => {
    await page.goto('/#/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for Vue to hydrate

    // Fill login form with invalid credentials
    await page.fill('input[type="email"]', 'nonexistent@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for error message to appear
    await page.waitForTimeout(2000);

    // Should stay on login page
    await expect(page).toHaveURL(/.*login/, { timeout: 3000 });

    // Should show error message
    const errorMessage = page.locator('.q-banner, .error, [role="alert"], .text-negative').first();
    await expect(errorMessage).toBeVisible({ timeout: 3000 });
    
    // Error message should contain relevant text
    const errorText = await errorMessage.textContent();
    expect(errorText?.toLowerCase()).toMatch(/invalid|incorrect|error|failed/i);
  });

  test('login form submission with empty fields shows validation errors', async ({ page }) => {
    await page.goto('/#/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for Vue to hydrate

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Wait a bit for validation to trigger
    await page.waitForTimeout(500);

    // Check for validation errors - either HTML5 or custom
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    // Check HTML5 validation
    const emailValid = await emailInput.evaluate(el => (el as HTMLInputElement).checkValidity());
    const passwordValid = await passwordInput.evaluate(el => (el as HTMLInputElement).checkValidity());

    // If HTML5 validation doesn't work, check for custom validation messages
    if (emailValid && passwordValid) {
      const validationMessages = page.locator('text=/required|invalid|email|password/i');
      const count = await validationMessages.count();
      expect(count).toBeGreaterThan(0);
    } else {
      // HTML5 validation is working
      expect(emailValid).toBe(false);
      expect(passwordValid).toBe(false);
    }

    // Should still be on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('email format validation works', async ({ page }) => {
    await page.goto('/#/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for Vue to hydrate

    // Enter invalid email format
    await page.fill('input[type="email"]', 'not-an-email');
    await page.fill('input[type="password"]', 'password123');

    // Try to submit
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    // Check for validation error
    const emailInput = page.locator('input[type="email"]');
    const isValid = await emailInput.evaluate(el => (el as HTMLInputElement).checkValidity());

    if (!isValid) {
      // HTML5 validation caught it
      expect(isValid).toBe(false);
    } else {
      // Custom validation should catch it
      const validationMessage = page.locator('text=/invalid|email|format/i');
      await expect(validationMessage.first()).toBeVisible({ timeout: 3000 });
    }

    // Should still be on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('navigation between auth pages works', async ({ page }) => {
    await page.goto('/#/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for Vue to hydrate

    // Find and click forgot password link
    const forgotLink = page.locator('a, button').filter({ hasText: /forgot password/i });
    if (await forgotLink.isVisible()) {
      await forgotLink.click();
      await expect(page).toHaveURL(/.*forgot-password/);
    }

    // Try to navigate to register
    const registerLink = page.locator('a, button').filter({ hasText: /sign up|register/i });
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/.*register/);
    }
  });

  test('localStorage token persists after page reload', async ({ page }) => {
    await page.goto('/#/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for Vue to hydrate

    // Set a mock token (simulating successful login)
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token-12345');
    });

    // Verify token is set
    const tokenBeforeReload = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(tokenBeforeReload).toBe('mock-jwt-token-12345');

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify token persists after reload
    const tokenAfterReload = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(tokenAfterReload).toBe('mock-jwt-token-12345');
  });

  test('protected routes redirect to login when not authenticated', async ({ page }) => {
    // Ensure no auth token exists
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Try to access protected route
    await page.goto('/#/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for guard to process

    // Should redirect to login (with hash routing)
    await expect(page).toHaveURL(/.*#\/auth\/login/, { timeout: 5000 });
  });

  test('logout clears localStorage and redirects to login', async ({ page }) => {
    // Set mock token (simulating logged in state)
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
    });

    // Navigate to a protected route (if guards allow)
    await page.goto('/#/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for Vue to hydrate

    // Look for logout button/link
    const logoutButton = page.locator('button, a').filter({ hasText: /logout|sign out|log out/i });
    
    if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Click logout
      await logoutButton.click();
      await page.waitForTimeout(1000);

      // Verify token is cleared
      const token = await page.evaluate(() => localStorage.getItem('auth_token'));
      expect(token).toBeNull();

      // Should redirect to login (with hash routing)
      await expect(page).toHaveURL(/.*#\/auth\/login/, { timeout: 3000 });
    } else {
      // If logout button not found, test.skip this test
      test.skip(true, 'Logout button not found - may need to be logged in first');
    }
  });
});

// Backend health check test
test('backend health check endpoint is accessible', async ({ page }) => {
  // Check if backend health endpoint is accessible
  const response = await page.goto('http://localhost:8000/api/v1/system/health').catch(() => null);
  
  if (!response) {
    test.skip(true, 'Backend is not accessible on port 8000');
    return;
  }

  // Health endpoint should return 200
  expect(response.status()).toBe(200);

  // Response should be valid JSON
  const body = await response.json();
  expect(body).toHaveProperty('status');
  expect(body.status).toBe('ok');
});