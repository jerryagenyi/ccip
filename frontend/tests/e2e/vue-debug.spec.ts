import { test, expect } from '@playwright/test';

test.describe('Vue App Mounting Debug', () => {
  test('comprehensive debug of Vue app', async ({ page }) => {
    // Enable console logging
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    const errors: string[] = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // Go to the page
    await page.goto('/auth/login');

    // Wait for initial load
    await page.waitForLoadState('networkidle');

    // Get page information
    console.log('\n=== PAGE INFO ===');
    console.log('URL:', page.url());
    console.log('Title:', await page.title());

    // Check for Vue app div
    const qApp = page.locator('#q-app');
    console.log('#q-app exists:', await qApp.count() > 0);
    console.log('#q-app visible:', await qApp.isVisible());
    console.log('#q-app innerHTML:', await qApp.innerHTML());

    // Check body content
    const body = page.locator('body');
    console.log('Body innerHTML length:', (await body.innerHTML()).length);

    // Wait for Vue to potentially load
    await page.waitForTimeout(3000);

    // Check again after waiting
    console.log('\n=== AFTER 3 SECOND WAIT ===');
    console.log('#q-app visible now:', await qApp.isVisible());

    // Evaluate Vue state in the browser
    const vueState = await page.evaluate(() => {
      return {
        hasVue: typeof window.Vue !== 'undefined',
        hasQuasar: typeof window.Quasar !== 'undefined',
        hasRouter: typeof window.__VUE_ROUTER__ !== 'undefined',
        qAppExists: !!document.querySelector('#q-app'),
        qAppChildren: document.querySelector('#q-app')?.children.length || 0,
        bodyClasses: document.body.className,
        appScripts: Array.from(document.scripts).map(s => s.src),
        localStorage: Object.keys(localStorage),
        sessionStorage: Object.keys(sessionStorage)
      };
    });

    console.log('\n=== VUE STATE ===');
    console.log(JSON.stringify(vueState, null, 2));

    // Check for any loaded Vue components
    const vueComponents = await page.evaluate(() => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            // Look for Vue-specific attributes or components
            if (node.getAttribute('data-v-') !== null ||
                node.__vue_app__ !== undefined ||
                node.classList.contains('q-')) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          }
        }
      );

      const components = [];
      let node;
      while (node = walker.nextNode()) {
        components.push({
          tagName: node.tagName,
          id: node.id,
          classes: node.className,
          attributes: Array.from(node.attributes).map(a => a.name)
        });
      }
      return components;
    });

    console.log('\n=== VUE COMPONENTS FOUND ===');
    console.log(JSON.stringify(vueComponents, null, 2));

    // Check network requests
    const requests = await page.evaluate(() => {
      return (window as any).__playwright_requests || [];
    });

    // Log console messages
    console.log('\n=== CONSOLE MESSAGES ===');
    consoleMessages.forEach(msg => console.log(msg));

    // Log errors
    console.log('\n=== ERRORS ===');
    errors.forEach(error => console.log(error));

    // Take a screenshot
    await page.screenshot({ path: 'vue-debug-screenshot.png', fullPage: true });
    console.log('\nScreenshot saved as vue-debug-screenshot.png');

    // Try to manually trigger Vue mount if it exists
    const mountResult = await page.evaluate(() => {
      try {
        // Check if there's a Vue app that didn't mount
        const appContainer = document.querySelector('#q-app');
        if (appContainer && !appContainer.children.length) {
          // Try to find a Vue app instance
          const scripts = Array.from(document.querySelectorAll('script'));
          for (const script of scripts) {
            if (script.textContent?.includes('createApp') || script.textContent?.includes('mount')) {
              return { foundVueScript: true, scriptContent: script.textContent?.substring(0, 200) };
            }
          }
        }
        return { manualMountAttempted: true };
      } catch (e) {
        return { error: (e as Error).message };
      }
    });

    console.log('\n=== MOUNT ATTEMPT ===');
    console.log(JSON.stringify(mountResult, null, 2));

    // Final check after more waiting
    await page.waitForTimeout(2000);
    console.log('\n=== FINAL STATE ===');
    console.log('#q-app visible:', await qApp.isVisible());
    console.log('#q-app content:', await qApp.textContent());

    // Assert basic expectations
    expect(await page.locator('#q-app').count()).toBe(1);

    if (errors.length > 0) {
      console.log('\n⚠️ JavaScript errors detected. Vue app might have failed to initialize.');
    }

    if (consoleMessages.length > 0) {
      console.log('\n📝 Console messages collected.');
    }
  });

  test('check router configuration', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const routerInfo = await page.evaluate(() => {
      // Try to access router information
      return {
        hasHistoryAPI: !!window.history,
        historyLength: window.history.length,
        currentPath: window.location.pathname,
        searchParams: window.location.search,
        hash: window.location.hash,
        documentReady: document.readyState,
        vueDevtools: !!document.querySelector('#vue-devtools')
      };
    });

    console.log('\n=== ROUTER INFO ===');
    console.log(JSON.stringify(routerInfo, null, 2));

    // Try different routes
    const routes = ['/', '/auth/login', '/auth/register', '/dashboard'];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForTimeout(1000);

      const routeInfo = await page.evaluate((r) => {
        return {
          path: window.location.pathname,
          title: document.title,
          hasQApp: !!document.querySelector('#q-app'),
          bodyContent: document.body.textContent?.substring(0, 100)
        };
      }, [route]);

      console.log(`\nRoute ${route}:`, JSON.stringify(routeInfo, null, 2));
    }
  });

  test('check Vue/Quasar version and loading', async ({ page }) => {
    const responses: any[] = [];

    page.on('response', response => {
      if (response.url().includes('.vue') ||
          response.url().includes('quasar') ||
          response.url().includes('vue')) {
        responses.push({
          url: response.url(),
          status: response.status()
        });
      }
    });

    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    console.log('\n=== VUE/QUASAR RESOURCES ===');
    responses.forEach(r => console.log(`${r.status}: ${r.url}`));

    // Check what scripts are loaded
    const scriptsInfo = await page.evaluate(() => {
      const scripts = Array.from(document.scripts);
      return scripts.map(script => ({
        src: script.src,
        type: script.type,
        content: script.textContent ? script.textContent.substring(0, 100) + '...' : null
      }));
    });

    console.log('\n=== LOADED SCRIPTS ===');
    scriptsInfo.forEach(s => console.log(s));
  });

  test('test with JavaScript enabled explicitly', async ({ page }) => {
    // Ensure JavaScript is enabled
    await page.context().addInitScript(() => {
      window['__playwright'] = true;
    });

    await page.goto('/auth/login');

    // Wait for scripts to execute
    await page.waitForFunction(() => {
      return document.readyState === 'complete';
    });

    // Additional wait for Vue to initialize
    await page.waitForTimeout(5000);

    // Check if Vue components exist now
    const componentsExist = await page.evaluate(() => {
      // Look for any Quasar components or Vue elements
      const elements = document.querySelectorAll('*');
      let found = false;

      elements.forEach(el => {
        if (el.classList.toString().includes('q-') ||
            el.tagName.includes('Q-') ||
            el.getAttribute('data-v-') ||
            el.__vue__) {
          found = true;
        }
      });

      return found;
    });

    console.log('Quasar/Vue components found:', componentsExist);

    // Take final screenshot
    await page.screenshot({ path: 'vue-final-screenshot.png', fullPage: true });
  });
});