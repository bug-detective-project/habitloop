import { expect, test } from '@playwright/test';
import { cardOf, checkOf, HABITS, openApp, setDay, TODAY } from '../../../support/app.ts';

function ringOf(page: Parameters<typeof cardOf>[0], habit: { id: number; name: string }) {
  return cardOf(page, habit.id).getByRole('progressbar', { name: `Weekly goal of ${habit.name}` });
}

test.describe('Ticket front-8: the progress ring of a habit', () => {
  test.beforeEach(async ({ request }) => {
    await setDay(request, HABITS.walk.id, TODAY, false);
  });

  test('each habit with a goal shows a ring with the share of the goal done in the last 7 days', async ({ page }) => {
    await openApp(page);

    // 4 of 5 days, 2 of 3, 7 of 7, 0 of 6.
    await expect(ringOf(page, HABITS.read)).toHaveAttribute('aria-valuenow', '80');
    await expect(ringOf(page, HABITS.walk)).toHaveAttribute('aria-valuenow', '67');
    await expect(ringOf(page, HABITS.water)).toHaveAttribute('aria-valuenow', '100');
    await expect(ringOf(page, HABITS.sugar)).toHaveAttribute('aria-valuenow', '0');
  });

  test('the ring is a progress bar from 0 to 100 that is visible on the card', async ({ page }) => {
    await openApp(page);
    const ring = ringOf(page, HABITS.read);

    await expect(ring).toBeVisible();
    await expect(ring).toHaveAttribute('aria-valuemin', '0');
    await expect(ring).toHaveAttribute('aria-valuemax', '100');
    await expect(ring).toContainText('80%');
    const box = await ring.boundingBox();
    expect(box, 'the ring must have a size').not.toBeNull();
    expect(Math.abs(box!.width - box!.height), 'the ring is as wide as it is tall').toBeLessThanOrEqual(2);
    expect(box!.width).toBeGreaterThanOrEqual(32);
  });

  test('a habit without a goal has no ring', async ({ page }) => {
    await openApp(page);

    await expect(cardOf(page, HABITS.stretch.id)).toBeVisible();
    await expect(cardOf(page, HABITS.stretch.id).getByRole('progressbar')).toHaveCount(0);
  });

  test('the ring follows the habit when it is marked and unmarked', async ({ page }) => {
    await openApp(page);
    await expect(ringOf(page, HABITS.walk)).toHaveAttribute('aria-valuenow', '67');

    await checkOf(page, HABITS.walk).click();
    await expect(ringOf(page, HABITS.walk)).toHaveAttribute('aria-valuenow', '100');

    await checkOf(page, HABITS.walk).click();
    await expect(ringOf(page, HABITS.walk)).toHaveAttribute('aria-valuenow', '67');
  });

  test('more days than the goal still read 100%', async ({ page, request }) => {
    // "Call a friend" asks for 1 day a week; with two days done the ring stays full.
    await setDay(request, HABITS.friend.id, TODAY, true);
    await openApp(page);

    await expect(ringOf(page, HABITS.friend)).toHaveAttribute('aria-valuenow', '100');
    await expect(ringOf(page, HABITS.friend)).toContainText('100%');
  });
});
