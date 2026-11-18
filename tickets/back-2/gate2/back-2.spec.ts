import { expect, test } from '@playwright/test';
import { cardOf, HABITS, listHabits, openApp } from '../../../support/app.ts';

const LONG_NAME = 'Walk the dog around the whole park twice and then come back home through the long way by the river';

test.describe('Ticket back-2: a habit that cannot be saved is refused, not hidden', () => {
  test('an empty name is answered with 400 and a message', async ({ request }) => {
    const response = await request.post('/api/habits', { data: { name: '' } });

    expect(response.status(), 'POST /api/habits with an empty name').toBe(400);
    const body = (await response.json()) as { error?: string; fields?: Record<string, string> };
    expect(body.error, 'the message of the answer').toBe('Give the habit a name');
    expect(body.fields, 'the fields of the answer').toHaveProperty('name');
  });

  test('a name that is too long is answered with 400 and nothing is saved', async ({ request }) => {
    const before = await listHabits(request);

    const response = await request.post('/api/habits', { data: { name: LONG_NAME } });

    expect(response.status(), 'POST /api/habits with a name of 100 characters').toBe(400);
    expect(((await response.json()) as { error?: string }).error).toContain('80 characters');
    expect(await listHabits(request)).toEqual(before);
  });

  test('a goal out of range is answered with 400', async ({ request }) => {
    const response = await request.post('/api/habits', { data: { name: 'Run', weeklyGoal: 12 } });

    expect(response.status(), 'POST /api/habits with a goal of 12 days').toBe(400);
    expect(((await response.json()) as { fields?: Record<string, string> }).fields).toHaveProperty('weeklyGoal');
  });

  test('the screen shows the message and keeps the habits', async ({ page }) => {
    await openApp(page);
    await page.getByRole('button', { name: 'New habit' }).click();
    const form = page.getByRole('form', { name: 'New habit' });
    await form.getByLabel('Name').fill(LONG_NAME);
    await form.getByRole('button', { name: 'Save' }).click();

    await expect(form.getByRole('alert')).toContainText('80 characters');
    await expect(cardOf(page, HABITS.read.id)).toBeVisible();
    await expect(page.getByRole('list', { name: 'Habits' }).getByRole('listitem')).toHaveCount(8);
  });

  test('a valid habit is still created', async ({ request }) => {
    const response = await request.post('/api/habits', { data: { name: 'Floss', weeklyGoal: 7 } });

    expect(response.status(), 'POST /api/habits').toBe(201);
    expect((await listHabits(request)).map((habit) => habit.name)).toContain('Floss');
  });
});
