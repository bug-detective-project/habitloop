import { expect, test } from '@playwright/test';
import { collectPageErrors, listHabits } from '../../../support/app.ts';

test.describe('Ticket front-2: the app opens for someone without habits', () => {
  test('with no habits, the page invites the user to create the first one', async ({ page, request }) => {
    for (const habit of await listHabits(request)) {
      const response = await request.post(`/api/habits/${habit.id}/archive`);
      expect(response.status(), `POST /api/habits/${habit.id}/archive`).toBe(200);
    }
    expect(await listHabits(request)).toHaveLength(0);

    const errors = collectPageErrors(page);
    await page.goto('/');

    await expect(page.getByText('No habits yet')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'HabitLoop' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New habit' })).toBeVisible();
    expect(errors.map((error) => error.message), 'errors the page threw').toEqual([]);
  });

  test('the first habit can be created from the empty page and shows up', async ({ page, request }) => {
    expect(await listHabits(request), 'this test follows the one that empties the list').toHaveLength(0);
    const errors = collectPageErrors(page);
    await page.goto('/');
    await expect(page.getByText('No habits yet')).toBeVisible();

    await page.getByRole('button', { name: 'New habit' }).click();
    await page.getByLabel('Name').fill('Floss');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('heading', { level: 3, name: 'Floss' })).toBeVisible();
    await expect(page.getByText('No habits yet')).toHaveCount(0);
    expect(errors.map((error) => error.message), 'errors the page threw').toEqual([]);
  });
});
