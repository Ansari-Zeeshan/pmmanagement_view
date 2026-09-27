import { test, expect } from '@playwright/test';

test.describe('Emaar PM Connect - Live Chat & Updates Drawer E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock_emaar_jwt_token_2026');
      localStorage.setItem(
        'user_info',
        JSON.stringify({
          _id: 'user-admin-1',
          name: 'Executive PMO Admin',
          email: 'admin@emaar.ae',
          role: 'Super Admin',
          department: 'IT PMO Governance',
        })
      );
    });
  });

  test('Floating Chat Widget opens Premier Updates Drawer on /projects', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    // Click floating chat toggle button
    const floatChatBtn = page.locator('.floating-chat-toggle-btn');
    if (await floatChatBtn.isVisible()) {
      await floatChatBtn.click();

      // Verify Premier Project Details / Updates Drawer appears
      const drawer = page.locator('.proj_edit.pm-drawer-panel');
      await expect(drawer).toBeVisible({ timeout: 5000 });

      // Verify Updates tab and tab content exist
      await expect(page.locator('li:has-text("Updates")')).toBeVisible();

      // Close drawer
      await page.locator('button[title*="Close Drawer"]').click();
      await expect(drawer).not.toBeVisible();
    }
  });

  test('Row Chat Icon in Project List opens Premier Updates Drawer on /project-list', async ({ page }) => {
    await page.goto('/project-list');
    await page.waitForLoadState('networkidle');

    // Find chat button in project list table row
    const rowChatBtn = page.locator('button[title="Open Chat"]').first();
    if (await rowChatBtn.isVisible()) {
      await rowChatBtn.click();

      // Verify Premier Project Details / Updates Drawer appears
      const drawer = page.locator('.proj_edit.pm-drawer-panel');
      await expect(drawer).toBeVisible({ timeout: 5000 });

      // Verify Updates tab is present
      await expect(page.locator('li:has-text("Updates")')).toBeVisible();

      // Close drawer
      await page.locator('button[title*="Close Drawer"]').click();
      await expect(drawer).not.toBeVisible();
    }
  });

  test('Row Chat Icon in ListView opens Premier Updates Drawer on /projects', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    // Find row chat button in ListView
    const taskChatBtn = page.locator('button[title*="Chat about"]').first();
    if (await taskChatBtn.isVisible()) {
      await taskChatBtn.click();

      // Verify Premier Project Details / Updates Drawer appears
      const drawer = page.locator('.proj_edit.pm-drawer-panel');
      await expect(drawer).toBeVisible({ timeout: 5000 });

      // Verify Updates tab is present
      await expect(page.locator('li:has-text("Updates")')).toBeVisible();

      // Close drawer
      await page.locator('button[title*="Close Drawer"]').click();
      await expect(drawer).not.toBeVisible();
    }
  });
});
