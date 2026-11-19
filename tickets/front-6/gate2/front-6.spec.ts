import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { openApp, openToday, openWeek, settle } from '../../../support/app.ts';

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

test.describe('Ticket front-6: the week stops asking the server once it leaves the screen', () => {
  test('while it is on the screen, the week refreshes itself', async ({ page }) => {
    await page.clock.install();
    const requests = countSummaryRequests(page);
    await openApp(page);
    await openWeek(page);
    const opened = requests();

    await page.clock.runFor(31_000);
    await settle(page);

    expect(requests() - opened, 'requests for the summary in 31 seconds with the week on the screen').toBeGreaterThanOrEqual(3);
  });

  test('after it leaves the screen, no request for the summary is made', async ({ page }) => {
    await page.clock.install();
    const requests = countSummaryRequests(page);
    await openApp(page);
    await openWeek(page);
    await openToday(page);
    await settle(page);
    const closed = requests();

    await page.clock.runFor(60_000);
    await settle(page);

    expect(requests() - closed, 'requests for the summary in the minute after the week left the screen').toBe(0);
  });

  test('coming back to it starts one refresh, not one more on top of the old ones', async ({ page }) => {
    await page.clock.install();
    const requests = countSummaryRequests(page);
    await openApp(page);
    for (let round = 0; round < 3; round += 1) {
      await openWeek(page);
      await openToday(page);
    }
    await openWeek(page);
    await settle(page);
    const opened = requests();

    await page.clock.runFor(30_500);
    await settle(page);

    // One request every 10 seconds: three in 30 seconds. Four weeks still refreshing would make twelve.
    expect(requests() - opened, 'requests for the summary in 30 seconds').toBeLessThanOrEqual(4);
  });
});
