import { expect, test } from '@playwright/test';
import { HABITS, openApp, openWeek, summaryRows, TODAY, YESTERDAY } from '../../../support/app.ts';

test.describe('Ticket back-4: the summary counts days, not marks', () => {
  test('a day marked twice counts as one day', async ({ request }) => {
    // "Practice guitar" was marked twice yesterday (phone and computer) and once today.
    const guitar = (await summaryRows(request)).find((row) => row.id === HABITS.guitar.id);

    expect(guitar, 'the row of "Practice guitar" in GET /api/summary').toBeDefined();
    expect(guitar!.days).toEqual([YESTERDAY, TODAY]);
    expect(guitar!.doneDays, 'days done').toBe(2);
    expect(guitar!.progress).toBe('2 of 4 days');
  });

  test('the count of every habit is the number of its marked days', async ({ request }) => {
    for (const row of await summaryRows(request)) {
      expect(row.doneDays, `days done of "${row.name}"`).toBe(row.days.length);
      expect(row.doneDays, `days done of "${row.name}"`).toBeLessThanOrEqual(7);
    }
  });

  test('marking today again from another device does not add a day', async ({ request }) => {
    const before = (await summaryRows(request)).find((row) => row.id === HABITS.water.id)!;
    expect(before.doneDays).toBe(7);

    for (let device = 0; device < 2; device += 1) {
      const response = await request.post(`/api/habits/${HABITS.water.id}/checkins`, { data: { day: TODAY } });
      expect(response.status(), `POST /api/habits/${HABITS.water.id}/checkins`).toBe(204);
    }

    const after = (await summaryRows(request)).find((row) => row.id === HABITS.water.id)!;
    expect(after.doneDays, 'days done after two more marks of today').toBe(7);
    expect(after.progress).toBe('7 of 7 days');
  });

  test('the panel of the last 7 days shows the fixed count', async ({ page }) => {
    await openApp(page);
    const panel = await openWeek(page);

    await expect(panel.getByTestId(`week-${HABITS.guitar.id}`).getByTestId('progress')).toHaveText('2 of 4 days');
    await expect(panel.getByTestId(`week-${HABITS.water.id}`).getByTestId('progress')).toHaveText('7 of 7 days');
  });
});
