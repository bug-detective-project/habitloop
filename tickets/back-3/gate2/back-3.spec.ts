import { expect, test } from '@playwright/test';
import { listHabits, openApp } from '../../../support/app.ts';

// The QA run starts the app with MAX_HABITS=10 (see run.ts); the sample has 8 habits.
const LIMIT = 10;
const MESSAGE = `You reached the limit of ${LIMIT} habits. Archive one to add another.`;

test.describe('Ticket back-3: the limit of habits follows the configuration', () => {
  test('habits can be created up to the configured limit', async ({ request }) => {
    expect(await listHabits(request)).toHaveLength(8);

    for (const name of ['Floss', 'Nap']) {
      const response = await request.post('/api/habits', { data: { name } });
      expect(response.status(), `POST /api/habits "${name}"`).toBe(201);
    }
    expect(await listHabits(request)).toHaveLength(LIMIT);
  });

  test('the habit after the limit is refused with 409 and the configured number', async ({ request }) => {
    expect(await listHabits(request), 'this test follows the one that fills the list').toHaveLength(LIMIT);

    const response = await request.post('/api/habits', { data: { name: 'One too many' } });

    expect(response.status(), 'POST /api/habits at the limit').toBe(409);
    expect(((await response.json()) as { error?: string }).error).toBe(MESSAGE);
    expect(await listHabits(request)).toHaveLength(LIMIT);
  });

  test('the screen shows why the habit was not created', async ({ page }) => {
    await openApp(page);
    await page.getByRole('button', { name: 'New habit' }).click();
    const form = page.getByRole('form', { name: 'New habit' });
    await form.getByLabel('Name').fill('One too many');
    await form.getByRole('button', { name: 'Save' }).click();

    await expect(form.getByRole('alert')).toHaveText(MESSAGE);
    await expect(page.getByRole('list', { name: 'Habits' }).getByRole('listitem')).toHaveCount(LIMIT);
  });

  test('changing a habit is not affected by the limit', async ({ request }) => {
    const response = await request.patch('/api/habits/3', { data: { name: 'Morning walk', weeklyGoal: 4 } });

    expect(response.status(), 'PATCH /api/habits/3 at the limit').toBe(200);
  });
});
