import { expect, test } from '@playwright/test';
import { cardOf, HABITS, listHabits, openApp, summaryRows } from '../../../support/app.ts';

test.describe('Ticket back-5: archiving a habit', () => {
  test('POST /api/habits/:id/archive answers the list without the habit', async ({ request }) => {
    const response = await request.post(`/api/habits/${HABITS.friend.id}/archive`);

    expect(response.status(), `POST /api/habits/${HABITS.friend.id}/archive`).toBe(200);
    const habits = (await response.json()) as { id: number }[];
    expect(habits.map((habit) => habit.id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('an archived habit is gone from the list and from the summary', async ({ request }) => {
    expect((await listHabits(request)).map((habit) => habit.id)).not.toContain(HABITS.friend.id);
    expect((await summaryRows(request)).map((row) => row.id)).not.toContain(HABITS.friend.id);
  });

  test('an archived habit cannot be changed, marked or archived again', async ({ request }) => {
    const id = HABITS.friend.id;

    expect((await request.patch(`/api/habits/${id}`, { data: { name: 'Back again' } })).status(), 'PATCH').toBe(404);
    expect((await request.post(`/api/habits/${id}/checkins`, { data: { day: '2026-03-18' } })).status(), 'mark').toBe(404);
    expect((await request.post(`/api/habits/${id}/archive`)).status(), 'archive again').toBe(404);
  });

  test('a habit that does not exist is answered with 404', async ({ request }) => {
    const response = await request.post('/api/habits/999/archive');

    expect(response.status(), 'POST /api/habits/999/archive').toBe(404);
    expect(((await response.json()) as { error?: string }).error).toBe('Habit not found');
  });

  test('the Archive button takes the habit off the screen for good', async ({ page }) => {
    await openApp(page);
    await page.getByRole('button', { name: `Edit ${HABITS.sugar.name}` }).click();
    await page.getByRole('form', { name: `Edit ${HABITS.sugar.name}` }).getByRole('button', { name: 'Archive' }).click();

    await expect(cardOf(page, HABITS.sugar.id)).toHaveCount(0);
    await expect(cardOf(page, HABITS.read.id)).toBeVisible();

    await page.reload();
    await expect(cardOf(page, HABITS.read.id)).toBeVisible();
    await expect(cardOf(page, HABITS.sugar.id)).toHaveCount(0);
  });

  test('archiving frees a place under the limit of habits', async ({ request }) => {
    // The QA run allows 10 habits; 6 are left after the two that were archived.
    for (let index = 0; index < 4; index += 1) {
      expect((await request.post('/api/habits', { data: { name: `Extra ${index}` } })).status(), 'POST /api/habits').toBe(201);
    }
    expect((await request.post('/api/habits', { data: { name: 'One too many' } })).status(), 'at the limit').toBe(409);

    expect((await request.post(`/api/habits/${HABITS.water.id}/archive`)).status(), 'archive').toBe(200);

    expect((await request.post('/api/habits', { data: { name: 'Fits now' } })).status(), 'after archiving').toBe(201);
  });
});
