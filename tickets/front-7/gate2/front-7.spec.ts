import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HABITS, openApp, openWeek, setDay, settle, summaryRows, YESTERDAY } from '../../../support/app.ts';

/**
 * Holds the next request the page makes for the summary: the server answers it at once (with the
 * days as they are at that moment), and the page only gets the answer when `release` is called.
 */
async function holdNextSummary(page: Page): Promise<{ asked: Promise<void>; release: () => Promise<void> }> {
  let armed = true;
  let markAsked: () => void = () => {};
  let open: () => void = () => {};
  let markDelivered: () => void = () => {};
  const asked = new Promise<void>((resolve) => (markAsked = resolve));
  const gate = new Promise<void>((resolve) => (open = resolve));
  const delivered = new Promise<void>((resolve) => (markDelivered = resolve));

  await page.route('**/api/summary', async (route) => {
    if (!armed) {
      await route.continue();
      return;
    }
    armed = false;
    const response = await route.fetch();
    markAsked();
    await gate;
    await route.fulfill({ response });
    markDelivered();
  });

  return {
    asked,
    release: async () => {
      open();
      await delivered;
    },
  };
}

test.describe('Ticket front-7: a late answer of the refresh does not undo a new mark', () => {
  test('a day marked while a refresh is on its way stays marked when the old answer arrives', async ({ page, request }) => {
    await setDay(request, HABITS.stretch.id, YESTERDAY, false);
    await page.clock.install();
    await openApp(page);
    const panel = await openWeek(page);
    const day = panel.getByRole('button', { name: `${HABITS.stretch.name}, Tuesday, March 17` });
    await expect(day).toHaveAttribute('aria-pressed', 'false');

    // The refresh of the panel starts, and its answer is held.
    const held = await holdNextSummary(page);
    await page.clock.runFor(10_000);
    await held.asked;

    // The user marks the day; the panel saves it and shows it.
    const saved = page.waitForResponse((response) => response.request().method() === 'POST' && response.url().includes('/checkins'));
    await day.click();
    await saved;
    await expect(day).toHaveAttribute('aria-pressed', 'true');
    await expect
      .poll(async () => (await summaryRows(request)).find((row) => row.id === HABITS.stretch.id)?.days)
      .toContain(YESTERDAY);
    await settle(page);

    // Only now the old answer arrives, from before the day was marked.
    await held.release();
    await settle(page);
    await page.waitForTimeout(300);

    await expect(day, 'the day the user just marked').toHaveAttribute('aria-pressed', 'true');
    await expect(panel.getByTestId(`week-${HABITS.stretch.id}`).getByTestId('progress')).toHaveText('2 days');
  });

  test('a day unmarked while a refresh is on its way stays unmarked', async ({ page, request }) => {
    await setDay(request, HABITS.friend.id, YESTERDAY, true);
    await page.clock.install();
    await openApp(page);
    const panel = await openWeek(page);
    const day = panel.getByRole('button', { name: `${HABITS.friend.name}, Tuesday, March 17` });
    await expect(day).toHaveAttribute('aria-pressed', 'true');

    const held = await holdNextSummary(page);
    await page.clock.runFor(10_000);
    await held.asked;

    const saved = page.waitForResponse((response) => response.request().method() === 'DELETE' && response.url().includes('/checkins'));
    await day.click();
    await saved;
    await expect(day).toHaveAttribute('aria-pressed', 'false');
    await settle(page);

    await held.release();
    await settle(page);
    await page.waitForTimeout(300);

    await expect(day, 'the day the user just unmarked').toHaveAttribute('aria-pressed', 'false');
  });

  test('the panel still shows what changed on the server at the next refresh', async ({ page, request }) => {
    await setDay(request, HABITS.sugar.id, YESTERDAY, false);
    await page.clock.install();
    await openApp(page);
    const panel = await openWeek(page);
    const day = panel.getByRole('button', { name: `${HABITS.sugar.name}, Tuesday, March 17` });
    await expect(day).toHaveAttribute('aria-pressed', 'false');

    // Another device marks the day.
    await setDay(request, HABITS.sugar.id, YESTERDAY, true);
    await page.clock.runFor(10_500);

    await expect(day).toHaveAttribute('aria-pressed', 'true');
  });
});
