import { expect, test } from '@playwright/test';
import { cardOf, HABITS, openApp, openWeek, setDay, TODAY, YESTERDAY } from '../../../support/app.ts';

test.describe('Ticket front-5: marking an earlier day keeps the streak right', () => {
  test.beforeEach(async ({ request }) => {
    // "Read 10 pages": March 14, 15 and 16 and today are marked; yesterday is the gap.
    await setDay(request, HABITS.read.id, TODAY, true);
    await setDay(request, HABITS.read.id, YESTERDAY, false);
    // "Morning walk": March 16 and 17 are marked; today is not.
    await setDay(request, HABITS.walk.id, TODAY, false);
    await setDay(request, HABITS.walk.id, '2026-03-15', false);
  });

  test('filling yesterday joins the streak of today with the days before', async ({ page }) => {
    await openApp(page);
    const streak = cardOf(page, HABITS.read.id).getByTestId('streak');
    await expect(streak).toHaveText('1 day in a row');

    const panel = await openWeek(page);
    await panel.getByRole('button', { name: `${HABITS.read.name}, Tuesday, March 17` }).click();

    await expect(streak).toHaveText('5 days in a row');
  });

  test('the streak on the screen is the same after a reload', async ({ page }) => {
    await openApp(page);
    const panel = await openWeek(page);
    await panel.getByRole('button', { name: `${HABITS.read.name}, Tuesday, March 17` }).click();
    await expect(cardOf(page, HABITS.read.id).getByTestId('streak')).toHaveText('5 days in a row');

    await page.reload();

    await expect(cardOf(page, HABITS.read.id).getByTestId('streak')).toHaveText('5 days in a row');
  });

  test('an earlier day also extends a streak that ends yesterday', async ({ page }) => {
    await openApp(page);
    const streak = cardOf(page, HABITS.walk.id).getByTestId('streak');
    await expect(streak).toHaveText('2 days in a row');

    const panel = await openWeek(page);
    await panel.getByRole('button', { name: `${HABITS.walk.name}, Sunday, March 15` }).click();

    await expect(streak).toHaveText('3 days in a row');
  });

  test('unmarking a day in the middle still cuts the streak', async ({ page }) => {
    await openApp(page);
    const streak = cardOf(page, HABITS.water.id).getByTestId('streak');
    await expect(streak).toHaveText('10 days in a row');

    const panel = await openWeek(page);
    await panel.getByRole('button', { name: `${HABITS.water.name}, Monday, March 16` }).click();
    await expect(streak).toHaveText('2 days in a row');

    await panel.getByRole('button', { name: `${HABITS.water.name}, Monday, March 16` }).click();
    await expect(streak).toHaveText('10 days in a row');
  });
});
