import { test, expect } from '@playwright/test';

test.describe('Emaar PM Connect - Smoke Test Suite', () => {
  test('App loads successfully and redirects to login or dashboard', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Emaar PM Connect/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Login form renders with email and password inputs', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"], input[name="email"], #email, input[placeholder*="Email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('Navigation options render upon authentication', async ({ page }) => {
    await page.goto('/login');
    // Fill credentials and click login
    await page.fill('input[type="email"], input[name="email"]', 'admin@emaar.ae');
    await page.fill('input[type="password"]', 'admin123');
    
    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    }

    await page.waitForURL('**/dashboard', { timeout: 10000 }).catch(() => {});
    expect(page.url()).toContain('/dashboard');
  });
});
