import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { openApp, openWeek, settle } from '../../../support/app.ts';

/** Counts the requests the page makes for the summary. */
function countSummaryRequests(page: Page): () => number {
  let count = 0;
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/api/summary') {
      count += 1;
    }
  });
  return () => count;
}

test.describe('Ticket front-6: the panel stops asking the server once it is closed', () => {
  test('while it is open, the panel refreshes itself', async ({ page }) => {
    await page.clock.install();
    const requests = countSummaryRequests(page);
    await openApp(page);
    await openWeek(page);
    const opened = requests();

    await page.clock.runFor(31_000);
    await settle(page);

    expect(requests() - opened, 'requests for the summary in 31 seconds with the panel open').toBeGreaterThanOrEqual(3);
  });

  test('after it is closed, no request for the summary is made', async ({ page }) => {
    await page.clock.install();
    const requests = countSummaryRequests(page);
    await openApp(page);
    await openWeek(page);
    await page.getByRole('button', { name: 'Last 7 days' }).click();
    await expect(page.getByRole('complementary', { name: 'Last 7 days' })).toHaveCount(0);
    await settle(page);
    const closed = requests();

    await page.clock.runFor(60_000);
    await settle(page);

    expect(requests() - closed, 'requests for the summary in the minute after the panel was closed').toBe(0);
  });

  test('opening it again starts one refresh, not one more on top of the old ones', async ({ page }) => {
    await page.clock.install();
    const requests = countSummaryRequests(page);
    await openApp(page);
    const toggle = page.getByRole('button', { name: 'Last 7 days' });
    for (let round = 0; round < 3; round += 1) {
      await openWeek(page);
      await toggle.click();
      await expect(page.getByRole('complementary', { name: 'Last 7 days' })).toHaveCount(0);
    }
    await openWeek(page);
    await settle(page);
    const opened = requests();

    await page.clock.runFor(30_500);
    await settle(page);

    // One request every 10 seconds: three in 30 seconds. Four panels still refreshing would make twelve.
    expect(requests() - opened, 'requests for the summary in 30 seconds').toBeLessThanOrEqual(4);
  });
});
