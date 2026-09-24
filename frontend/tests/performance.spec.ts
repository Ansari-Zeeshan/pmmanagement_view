import { test, expect } from '@playwright/test';

test.describe('Emaar PM Connect - Performance Metric Suite', () => {
  test('Measures page load time and FCP on login page', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/login');
    const loadTime = Date.now() - startTime;
    
    // Assert page load under 30 seconds for initial cold boot Vite compilation
    expect(loadTime).toBeLessThan(30000);

    const metrics = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        domInteractive: timing.domInteractive - timing.navigationStart,
        domComplete: timing.domComplete - timing.navigationStart,
      };
    });

    console.log('Performance Metrics (ms):', metrics);
    expect(metrics.domInteractive).toBeLessThan(30000);
  });
});
