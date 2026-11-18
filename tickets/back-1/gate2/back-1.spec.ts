import { expect, test } from '@playwright/test';
import { HABITS, openApp, openWeek, summaryRows } from '../../../support/app.ts';

test.describe('Ticket back-1: the progress of a habit without a goal', () => {
  test('the summary says only the days done for a habit without a goal', async ({ request }) => {
    const stretch = (await summaryRows(request)).find((row) => row.id === HABITS.stretch.id);

    expect(stretch, 'the row of "Stretch" in GET /api/summary').toBeDefined();
    expect(stretch!.weeklyGoal).toBeNull();
    expect(stretch!.progress).toBe('1 day');
  });

  test('no progress line mentions null or undefined', async ({ request }) => {
    const created = await request.post('/api/habits', { data: { name: 'Nap' } });
    expect(created.status(), 'POST /api/habits').toBe(201);

    const rows = await summaryRows(request);
    for (const row of rows) {
      expect(row.progress, `the progress of "${row.name}"`).not.toMatch(/null|undefined|NaN/);
    }
    expect(rows.find((row) => row.name === 'Nap')?.progress).toBe('0 days');
  });

  test('habits with a goal keep "done of goal"', async ({ request }) => {
    const rows = await summaryRows(request);

    expect(rows.find((row) => row.id === HABITS.read.id)?.progress).toBe('4 of 5 days');
    expect(rows.find((row) => row.id === HABITS.friend.id)?.progress).toBe('1 of 1 day');
    expect(rows.find((row) => row.id === HABITS.sugar.id)?.progress).toBe('0 of 6 days');
  });

  test('the panel of the last 7 days shows the fixed line', async ({ page }) => {
    await openApp(page);
    const panel = await openWeek(page);

    await expect(panel.getByTestId(`week-${HABITS.stretch.id}`).getByTestId('progress')).toHaveText('1 day');
    await expect(panel.getByTestId(`week-${HABITS.read.id}`).getByTestId('progress')).toHaveText('4 of 5 days');
  });
});
