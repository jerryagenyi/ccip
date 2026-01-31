import { test } from '@playwright/test';

test.describe('Manual Auth Check', () => {
  test('check login page and take screenshot', async ({ page }) => {
    await page.goto('http://localhost:5173/#/auth/login');

    // Wait for page to load
    await page.waitForTimeout(3000);

    // Take a screenshot to see what's rendered
    await page.screenshot({ path: 'test-results/manual-login-page.png', fullPage: true });

    // Check page content
    console.log('Page HTML length:', (await page.content()).length);

    // Check for login form elements
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    const hasEmail = await emailInput.count();
    const hasPassword = await passwordInput.count();
    const hasButton = await submitButton.count();

    console.log('Email inputs found:', hasEmail);
    console.log('Password inputs found:', hasPassword);
    console.log('Submit buttons found:', hasButton);

    // Check for Vue app mount point
    const qApp = page.locator('#q-app');
    const hasQApp = await qApp.count();
    console.log('#q-app elements found:', hasQApp);

    if (hasQApp > 0) {
      const qAppChildren = await qApp.locator('> *').count();
      console.log('#q-app children count:', qAppChildren);
    }

    // Check for any Quasar components
    const quasarComponents = await page.locator('[class*="q-"]').count();
    console.log('Quasar components found:', quasarComponents);

    // Get page title
    const title = await page.title();
    console.log('Page title:', title);
  });

  test('check register page', async ({ page }) => {
    await page.goto('http://localhost:5173/#/auth/register');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/manual-register-page.png', fullPage: true });
    console.log('Register page screenshot taken');
  });

  test('check forgot password page', async ({ page }) => {
    await page.goto('http://localhost:5173/#/auth/forgot-password');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/manual-forgot-password-page.png', fullPage: true });
    console.log('Forgot password page screenshot taken');
  });
});
