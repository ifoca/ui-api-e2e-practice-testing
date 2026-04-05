import { test, expect } from '@playwright/test';

test.describe('Checkout flow', () => {
  test('product grid loads asynchronously', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.card')).toHaveCount(9, { timeout: 8_000 });
  });
});
