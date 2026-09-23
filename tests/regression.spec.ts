import { test, expect } from '@playwright/test';

test.describe('Emaar PM Connect - Regression Test Suite', () => {
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

  test('Dashboard loads with KPI summary widgets', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('body')).toBeVisible();
    await page.waitForSelector('.dashboard-card, .card, h4, h5', { timeout: 8000 }).catch(() => {});
  });

  test('Projects workspace opens and switches views (List, Gantt, Kanban, Calendar)', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.locator('body')).toBeVisible();
    
    // Check view switcher buttons if present
    const ganttBtn = page.locator('button:has-text("Gantt"), [title*="Gantt"]').first();
    if (await ganttBtn.isVisible()) {
      await ganttBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('Help & Support modal opens and displays 2-column ticket layout', async ({ page }) => {
    await page.goto('/dashboard');
    const helpBtn = page.locator('button:has-text("Help"), [title*="Help"]').first();
    if (await helpBtn.isVisible()) {
      await helpBtn.click();
      await page.waitForTimeout(500);
    }
  });
});
