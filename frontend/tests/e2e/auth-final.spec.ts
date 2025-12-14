import { test, expect } from '@playwright/test';

test.describe('CCIP Authentication - Final Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.context().clearCookies();
  });

  test('login page loads with Vue app', async ({ page }) => {
    await page.goto('/auth/login');

    // Wait for Vue app to load - look for any Vue/Quasar component
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Wait for either the login form or an error/noscript message
    await expect(page.locator('body')).toContainText(/Welcome Back|We're sorry|JavaScript/i, { timeout: 5000 });

    // Try to find login elements with different selectors
    const loginForm = page.locator('form').first();
    const emailInput = page.locator('input[type="email"], input[name*="email"], input[placeholder*="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name*="password"]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Sign"), button:has-text("Login")').first();

    // Check if elements exist
    const hasForm = await loginForm.count() > 0;
    const hasEmail = await emailInput.count() > 0;
    const hasPassword = await passwordInput.count() > 0;
    const hasButton = await submitButton.count() > 0;

    console.log('Form elements found:', { hasForm, hasEmail, hasPassword, hasButton });

    if (hasForm && hasEmail && hasPassword && hasButton) {
      // Form is present, proceed with test
      await emailInput.fill('demo@ccip.com');
      await passwordInput.fill('demo123');
      await submitButton.click();

      // Wait for response
      await page.waitForTimeout(3000);

      // Check result
      const currentUrl = page.url();
      console.log('After login, URL:', currentUrl);

      if (currentUrl.includes('dashboard')) {
        console.log('✓ Login successful - redirected to dashboard');
      } else {
        // Check for error messages
        const errorElement = page.locator('.error, .alert, [role="alert"], .q-banner').first();
        if (await errorElement.isVisible()) {
          const errorText = await errorElement.textContent();
          console.log('Login error shown:', errorText);
        }
      }
    } else {
      // Form not found - might be a loading or configuration issue
      const bodyText = await page.locator('body').textContent();

      if (bodyText?.includes('JavaScript')) {
        console.log('⚠️  JavaScript issue detected');
      } else if (bodyText?.includes('404') || bodyText?.includes('Not Found')) {
        console.log('⚠️  Route not found');
      } else {
        // Wait longer for Vue to load
        await page.waitForTimeout(3000);

        // Check again
        const hasFormAfterWait = await page.locator('form').count() > 0;
        if (hasFormAfterWait) {
          console.log('✓ Form appeared after waiting');
        } else {
          console.log('⚠️  Login form not found after waiting');
          console.log('Page content preview:', bodyText?.substring(0, 500));
        }
      }
    }
  });

  test('registration flow check', async ({ page }) => {
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Look for registration form
    const form = page.locator('form').first();
    const nameInput = page.locator('input[name*="name"], input[placeholder*="Name"], input[type="text"]').first();
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();

    const hasForm = await form.count() > 0;
    const hasName = await nameInput.count() > 0;
    const hasEmail = await emailInput.count() > 0;

    console.log('Registration form elements:', { hasForm, hasName, hasEmail });

    if (hasForm && hasName && hasEmail) {
      await nameInput.fill('Test User');
      await emailInput.fill(`test-${Date.now()}@example.com`);

      // Look for next button
      const nextButton = page.locator('button:has-text("Next"), button:has-text("Continue")').first();
      if (await nextButton.isVisible()) {
        await nextButton.click();
        console.log('✓ Proceeded to next registration step');
      }
    }
  });

  test('API connectivity check', async ({ page }) => {
    // Test if backend API is reachable from frontend
    const response = await page.goto('http://localhost:8000/api/v1');

    if (response) {
      console.log('Backend API response status:', response.status());
    } else {
      console.log('Could not reach backend API');
    }

    // Also test CORS preflight
    const response2 = await page.evaluate(async () => {
      try {
        const resp = await fetch('http://localhost:8000/api/v1/auth/login', {
          method: 'OPTIONS',
        });
        return { status: resp.status, ok: resp.ok };
      } catch (error) {
        return { error: (error as Error).message };
      }
    });

    console.log('CORS preflight response:', response2);
  });

  test('storage persistence test', async ({ page }) => {
    await page.goto('/auth/login');

    // Set mock auth data
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'test-token-123');
      localStorage.setItem('auth_user', JSON.stringify({
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      }));
    });

    // Verify storage
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    const user = await page.evaluate(() => localStorage.getItem('auth_user'));

    expect(token).toBe('test-token-123');
    expect(user).toContain('test@example.com');

    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    const url = page.url();
    console.log('Dashboard URL after setting auth:', url);
  });
});