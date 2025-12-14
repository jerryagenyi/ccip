import { test, expect } from '@playwright/test';

test.describe('Fix Vue Mounting Issue', () => {
  test('wait for Vue app to properly initialize', async ({ page }) => {
    // Add error logging
    const errors: string[] = [];
    page.on('pageerror', error => {
      errors.push(error.toString());
      console.error('Page error:', error);
    });

    page.on('requestfailed', request => {
      console.log('Request failed:', request.url(), request.failure()?.errorText);
    });

    // Enable more detailed console logging
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warn') {
        console.log(`Console ${msg.type()}:`, msg.text());
      }
    });

    // Set up page context before navigation
    await page.addInitScript(() => {
      // Add a marker to know we're in a test environment
      window.__PLAYWRIGHT_TEST__ = true;
    });

    // Navigate to the page
    const response = await page.goto('/auth/login', { waitUntil: 'networkidle' });

    console.log('Page loaded with status:', response?.status());

    // Wait for the #q-app element to be present
    await page.waitForSelector('#q-app', { state: 'attached' });

    // Now wait for Vue to actually mount
    await page.waitForFunction(() => {
      const qApp = document.querySelector('#q-app');
      return qApp && qApp.children.length > 0;
    }, {
      timeout: 10000
    }).catch(() => {
      console.log('Vue did not mount within timeout');
    });

    // Check for Vue app
    const hasVueContent = await page.locator('#q-app').count() > 0;
    const qAppContent = await page.locator('#q-app').innerHTML();

    console.log('Has #q-app:', hasVueContent);
    console.log('#q-app children count:', await page.locator('#q-app > *').count());
    console.log('#q-app content preview:', qAppContent.substring(0, 200));

    // If Vue didn't mount, let's try to force it
    if (!qAppContent || qAppContent.trim().length === 0) {
      console.log('Attempting to force Vue mount...');

      // Check if Vue and Quasar are available
      const vueStatus = await page.evaluate(() => {
        return {
          vue: typeof window.Vue,
          quasar: typeof window.Quasar,
          hasApp: !!(window as any).__VUE__,
          scripts: Array.from(document.scripts).map(s => ({
            src: s.src,
            loaded: s.hasAttribute('data-loaded')
          }))
        };
      });

      console.log('Vue status:', JSON.stringify(vueStatus, null, 2));

      // Try waiting for scripts to load
      await page.waitForTimeout(2000);

      // Check again
      const afterWait = await page.evaluate(() => {
        const qApp = document.querySelector('#q-app');
        return {
          children: qApp ? qApp.children.length : 0,
          innerHTML: qApp ? qApp.innerHTML : 'no q-app'
        };
      });

      console.log('After wait status:', afterWait);
    }

    // Take screenshot for debugging
    await page.screenshot({ path: 'vue-mount-attempt.png', fullPage: true });

    // Final check - look for any Vue/Quasar components
    const components = await page.evaluate(() => {
      const all = document.querySelectorAll('*');
      const vueComponents = [];

      for (const el of all) {
        const classes = el.className.toString();
        if (classes.includes('q-') || el.tagName.toLowerCase().startsWith('q-')) {
          vueComponents.push({
            tag: el.tagName,
            class: classes,
            id: el.id
          });
        }
      }

      return vueComponents;
    });

    console.log('Found Quasar components:', components.length);
    components.slice(0, 5).forEach(c => console.log(c));

    // If we still have no Vue content, let's check what's in the noscript
    const noscriptContent = await page.locator('noscript').textContent();
    if (noscriptContent) {
      console.log('Noscript content found:', noscriptContent);
    }
  });

  test('try different navigation approach', async ({ page }) => {
    // Sometimes the issue is with how we navigate
    console.log('Testing direct navigation...');

    // First go to root
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Wait a bit for initialization
    await page.waitForTimeout(3000);

    // Check state
    const rootState = await page.evaluate(() => ({
      url: window.location.href,
      qAppExists: !!document.querySelector('#q-app'),
      qAppChildren: document.querySelector('#q-app')?.children.length || 0
    }));

    console.log('Root state:', rootState);

    // Now try navigating using JavaScript
    await page.evaluate(() => {
      window.history.pushState({}, '', '/auth/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    await page.waitForTimeout(2000);

    const afterNavState = await page.evaluate(() => ({
      url: window.location.href,
      qAppExists: !!document.querySelector('#q-app'),
      qAppChildren: document.querySelector('#q-app')?.children.length || 0
    }));

    console.log('After navigation state:', afterNavState);
  });

  test('check with no guards', async ({ page }) => {
    // Temporarily disable guards to see if that's the issue
    await page.route('**/guards.ts', async route => {
      // Return a minimal guards file
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: `
          export function authGuard(to, from, next) { next(); }
          export function guestGuard(to, from, next) { next(); }
          export function roleGuard(to, from, next) { next(); }
          export function globalGuard(to, from, next) { next(); }
        `
      });
    });

    // Also intercept the boot router file
    await page.route('**/boot/router.ts', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: `
          export default boot(({ router }) => {
            // No guards for testing
          });
        `
      });
    });

    await page.goto('/auth/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);

    const state = await page.evaluate(() => ({
      qAppChildren: document.querySelector('#q-app')?.children.length || 0,
      innerHTML: document.querySelector('#q-app')?.innerHTML || 'empty'
    }));

    console.log('State with no guards:', state);

    await page.screenshot({ path: 'vue-no-guards.png', fullPage: true });
  });
});