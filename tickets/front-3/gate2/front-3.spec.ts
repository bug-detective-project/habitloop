import { expect, test } from '@playwright/test';
import { checkOf, habitNamed, HABITS, openApp, setDay, TODAY } from '../../../support/app.ts';

test.describe('Ticket front-3: marking a habit marks that habit only', () => {
  test.beforeEach(async ({ request }) => {
    for (const habit of [HABITS.walk, HABITS.stretch, HABITS.journal, HABITS.sugar, HABITS.friend]) {
      await setDay(request, habit.id, TODAY, false);
    }
  });

  test('marking the first habit of the list leaves the next ones unmarked', async ({ page, request }) => {
    await openApp(page);
    await expect(checkOf(page, HABITS.walk)).toHaveAttribute('aria-pressed', 'false');

    await checkOf(page, HABITS.walk).click();

    await expect(checkOf(page, HABITS.walk)).toHaveAttribute('aria-pressed', 'true');
    for (const habit of [HABITS.stretch, HABITS.journal, HABITS.sugar, HABITS.friend]) {
      await expect(checkOf(page, habit), `"${habit.name}" was not marked`).toHaveAttribute('aria-pressed', 'false');
    }
    expect((await habitNamed(request, HABITS.walk.name)).days).toContain(TODAY);
    expect((await habitNamed(request, HABITS.stretch.name)).days).not.toContain(TODAY);
  });

  test('marking two habits in a row marks exactly those two', async ({ page }) => {
    await openApp(page);

    await checkOf(page, HABITS.walk).click();
    await expect(checkOf(page, HABITS.walk)).toHaveAttribute('aria-pressed', 'true');
    await checkOf(page, HABITS.journal).click();
    await expect(checkOf(page, HABITS.journal)).toHaveAttribute('aria-pressed', 'true');

    for (const habit of [HABITS.stretch, HABITS.sugar, HABITS.friend]) {
      await expect(checkOf(page, habit), `"${habit.name}" was not marked`).toHaveAttribute('aria-pressed', 'false');
    }
  });

  test('the screen shows the same as after a reload', async ({ page }) => {
    await openApp(page);
    await checkOf(page, HABITS.stretch).click();
    await expect(checkOf(page, HABITS.stretch)).toHaveAttribute('aria-pressed', 'true');

    const pressed = async () =>
      Promise.all(Object.values(HABITS).map(async (habit) => `${habit.id}:${await checkOf(page, habit).getAttribute('aria-pressed')}`));
    const before = await pressed();
    await page.reload();
    await expect(checkOf(page, HABITS.stretch)).toHaveAttribute('aria-pressed', 'true');

    expect(await pressed()).toEqual(before);
  });
});
