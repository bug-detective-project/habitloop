import { expect, test } from '@playwright/test';
import type { APIRequestContext, Page } from '@playwright/test';
import { HABITS, openApp } from '../../../support/app.ts';

interface HistoryHabit {
  id: number;
  startedOn: string;
  days: string[];
}

const SPOKEN = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });

/** What the calendar cell of a day must say, worked out from the API itself. */
async function expectedCell(request: APIRequestContext, day: string, habitId?: number): Promise<string> {
  const query = `from=${day}&to=${day}${habitId === undefined ? '' : `&habit=${habitId}`}`;
  const response = await request.get(`/api/history?${query}`);
  expect(response.status(), `GET /api/history?${query}`).toBe(200);
  const habits = ((await response.json()) as { habits: HistoryHabit[] }).habits;
  const name = SPOKEN.format(new Date(`${day}T00:00:00Z`));
  const active = habits.filter((habit) => habit.startedOn <= day);
  const done = active.filter((habit) => habit.days.includes(day));
  if (habitId !== undefined) {
    return `${name}: ${active.length === 0 ? 'not started yet' : done.length === 1 ? 'done' : 'not done'}`;
  }
  return `${name}: ${active.length === 0 ? 'no habit yet' : `${done.length} of ${active.length} habits done`}`;
}

/** The marked days of a habit from one day to another, from the API. */
async function markedDays(request: APIRequestContext, habitId: number, from: string, to: string): Promise<number> {
  const response = await request.get(`/api/history?from=${from}&to=${to}&habit=${habitId}`);
  return ((await response.json()) as { habits: HistoryHabit[] }).habits[0]!.days.length;
}

async function openMonth(page: Page): Promise<void> {
  await openApp(page);
  await page.getByRole('button', { name: 'History', exact: true }).click();
  await page.getByRole('tab', { name: 'Month' }).click();
}

const cellOf = (page: Page, day: string) => page.getByTestId(`cell-${day}`);

test.describe('Ticket front-9: the month shows the marks of its own days', () => {
  test('March counts the habits done on each of its days', async ({ page, request }) => {
    await openMonth(page);

    await expect(page.getByTestId('period')).toHaveText('March 2026');
    for (const day of ['2026-03-02', '2026-03-10', '2026-03-16', '2026-03-18']) {
      await expect(cellOf(page, day)).toHaveAttribute('aria-label', await expectedCell(request, day));
    }
  });

  test('the summary of March counts the days of March, up to today', async ({ page, request }) => {
    await openMonth(page);

    const done = await markedDays(request, HABITS.water.id, '2026-03-01', '2026-03-18');
    await expect(page.getByTestId(`summary-${HABITS.water.id}`)).toContainText(`${done} of 18`);
  });

  test('February, a month back, counts its own days', async ({ page, request }) => {
    await openMonth(page);
    await page.getByRole('button', { name: 'Previous month' }).click();

    await expect(page.getByTestId('period')).toHaveText('February 2026');
    for (const day of ['2026-02-03', '2026-02-17', '2026-02-28']) {
      await expect(cellOf(page, day)).toHaveAttribute('aria-label', await expectedCell(request, day));
    }
    const done = await markedDays(request, HABITS.water.id, '2026-02-01', '2026-02-28');
    await expect(page.getByTestId(`summary-${HABITS.water.id}`)).toContainText(`${done} of 28`);
  });

  test('January, the first month of the year, loads and counts its days', async ({ page, request }) => {
    await openMonth(page);
    await page.getByRole('button', { name: 'Previous month' }).click();
    await page.getByRole('button', { name: 'Previous month' }).click();

    await expect(page.getByTestId('period')).toHaveText('January 2026');
    await expect(page.getByText('The history could not be loaded.')).toHaveCount(0);
    for (const day of ['2026-01-05', '2026-01-20']) {
      await expect(cellOf(page, day)).toHaveAttribute('aria-label', await expectedCell(request, day));
    }
  });

  test('one habit shows its own days of the month', async ({ page, request }) => {
    await openMonth(page);
    await page.getByLabel('Habit', { exact: true }).selectOption({ label: HABITS.read.name });

    for (const day of ['2026-03-04', '2026-03-14', '2026-03-17']) {
      await expect(cellOf(page, day)).toHaveAttribute('aria-label', await expectedCell(request, day, HABITS.read.id));
    }
  });
});
