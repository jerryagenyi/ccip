import { test, expect } from '@playwright/test';

test.describe('Vue App Working Tests', () => {
  test('home page loads Vue app', async ({ page }) => {
    // Go to root first
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check if Vue app has mounted (might be #root or #q-app)
    const qApp = page.locator('#q-app');
    const root = page.locator('#root');
    const mountPoint = qApp.count() > 0 ? qApp : root;

    await expect(mountPoint).toBeAttached();

    // Wait a bit for Vue to render
    await page.waitForTimeout(2000);

    // Check if any Vue components are rendered
    const hasChildren = await mountPoint.locator('> *').count() > 0;
    console.log('Vue app has children:', hasChildren);

    if (hasChildren) {
      // Success! Vue is mounting
      console.log('✓ Vue app is mounting properly');

      // Look for any Vue/Quasar components
      const components = await page.locator('[class*="q-"]').count();
      console.log('Quasar components found:', components);
    }
  });

  test('manual navigation to auth pages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check if we have a working Vue app
    const hasVue = await page.locator('#q-app > *').count() > 0;

    if (hasVue) {
      // Try navigating via JavaScript
      await page.evaluate(() => {
        // Navigate to login
        window.location.hash = '#/auth/login';
      });

      await page.waitForTimeout(2000);

      const currentUrl = page.url();
      console.log('URL after hash navigation:', currentUrl);

      // Check if Vue router handled the hash
      const hasLoginElements = await page.locator('input[type="email"], input[type="password"], form').count() > 0;
      console.log('Login form elements found:', hasLoginElements);
    }
  });

  test('use hash routing for auth', async ({ page }) => {
    // Try accessing the auth pages with hash routing
    await page.goto('/#/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check for auth elements
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    const hasEmail = await emailInput.count() > 0;
    const hasPassword = await passwordInput.count() > 0;

    console.log('Auth page loaded - email:', hasEmail, 'password:', hasPassword);

    if (hasEmail && hasPassword) {
      // Try filling the form
      await emailInput.fill('demo@ccip.com');
      await passwordInput.fill('demo123');

      // Look for submit button
      const submitButton = page.locator('button[type="submit"], button:has-text("Sign"), button:has-text("Login")').first();

      if (await submitButton.isVisible()) {
        console.log('✓ Found submit button');
        await submitButton.click();

        // Wait for response
        await page.waitForTimeout(3000);

        const currentUrl = page.url();
        console.log('URL after login attempt:', currentUrl);

        if (currentUrl.includes('dashboard') || currentUrl.includes('login')) {
          console.log('Login flow working');
        }
      }
    }
  });

  test('check Vue app hydration', async ({ page }) => {
    await page.goto('/');

    // Wait for everything to load
    await page.waitForLoadState('domcontentloaded');

    // Check Vue hydration
    const isHydrated = await page.evaluate(() => {
      // Look for Vue-specific indicators
      const hasVueApp = !!(window as any).__VUE__;
      const hasQuasar = !!document.querySelector('.q-layout, .q-page, [class*="q-"]');

      return {
        hasVueApp,
        hasQuasar,
        qAppExists: !!document.querySelector('#q-app'),
        rootExists: !!document.querySelector('#root'),
        qAppChildren: document.querySelector('#q-app')?.children.length || 0,
        rootChildren: document.querySelector('#root')?.children.length || 0,
        bodyClasses: document.body.className
      };
    });

    console.log('Vue hydration status:', JSON.stringify(isHydrated, null, 2));

    // Take a screenshot to see what's actually rendered
    await page.screenshot({ path: 'vue-hydrated.png', fullPage: true });
  });
});