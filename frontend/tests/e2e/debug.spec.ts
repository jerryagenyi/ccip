import { test } from '@playwright/test';

test('debug page loading', async ({ page }) => {
  // Go to root
  await page.goto('/');

  // Wait and check title
  await page.waitForTimeout(2000);
  console.log('Page title:', await page.title());
  console.log('Current URL:', page.url());

  // Try different auth routes
  const routes = ['/auth/login', '/login', '/auth/register'];

  for (const route of routes) {
    await page.goto(route);
    await page.waitForTimeout(2000);

    console.log(`\nRoute: ${route}`);
    console.log('URL:', page.url());
    console.log('Title:', await page.title());

    // Check for any form elements
    const inputs = await page.locator('input').count();
    const buttons = await page.locator('button').count();
    console.log(`Found ${inputs} inputs and ${buttons} buttons`);

    // Get page content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text preview:', bodyText?.substring(0, 200));
  }
});