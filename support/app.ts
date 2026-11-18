import { expect } from '@playwright/test';
import type { APIRequestContext, Locator, Page } from '@playwright/test';

/** The day the QA run gives the app as today (HABITLOOP_TODAY in run.ts), a Wednesday. */
export const TODAY = '2026-03-18';
export const YESTERDAY = '2026-03-17';

/** The sample habits by id (server/src/seed.ts of the app). */
export const HABITS = {
  water: { id: 1, name: 'Drink eight glasses of water' },
  read: { id: 2, name: 'Read 10 pages' },
  walk: { id: 3, name: 'Morning walk' },
  stretch: { id: 4, name: 'Stretch' },
  guitar: { id: 5, name: 'Practice guitar' },
  journal: { id: 6, name: 'Write three things I am grateful for in the paper journal before going to bed' },
  sugar: { id: 7, name: 'No sugar after dinner' },
  friend: { id: 8, name: 'Call a friend' },
} as const;

export interface Habit {
  id: number;
  name: string;
  weeklyGoal: number | null;
  days: string[];
}

export interface SummaryRow {
  id: number;
  name: string;
  weeklyGoal: number | null;
  days: string[];
  doneDays: number;
  progress: string;
}

export async function listHabits(request: APIRequestContext): Promise<Habit[]> {
  const response = await request.get('/api/habits');
  expect(response.status(), 'GET /api/habits').toBe(200);
  return response.json();
}

export async function summaryRows(request: APIRequestContext): Promise<SummaryRow[]> {
  const response = await request.get('/api/summary');
  expect(response.status(), 'GET /api/summary').toBe(200);
  return ((await response.json()) as { habits: SummaryRow[] }).habits;
}

/** The habit with this name, as the API lists it now. */
export async function habitNamed(request: APIRequestContext, name: string): Promise<Habit> {
  const habit = (await listHabits(request)).find((item) => item.name === name);
  expect(habit, `the habit "${name}" in GET /api/habits`).toBeDefined();
  return habit!;
}

/** Makes the day marked or not marked for the habit, whatever it was before. */
export async function setDay(request: APIRequestContext, id: number, day: string, marked: boolean): Promise<void> {
  const cleared = await request.delete(`/api/habits/${id}/checkins/${day}`);
  expect(cleared.status(), `DELETE /api/habits/${id}/checkins/${day}`).toBe(204);
  if (marked) {
    const response = await request.post(`/api/habits/${id}/checkins`, { data: { day } });
    expect(response.status(), `POST /api/habits/${id}/checkins`).toBe(204);
  }
}

/** Opens the app and waits for the Today list. */
export async function openApp(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 2, name: 'Wednesday, March 18' })).toBeVisible();
}

/** The card of a habit in the Today list. */
export function cardOf(page: Page, id: number): Locator {
  return page.getByTestId(`habit-${id}`);
}

/** The round button of a card that says whether the habit is done today. */
export function checkOf(page: Page, habit: { id: number; name: string }): Locator {
  return cardOf(page, habit.id).getByRole('button', { name: `${habit.name}: done today` });
}

/** Opens the panel of the last 7 days and waits for its table. */
export async function openWeek(page: Page): Promise<Locator> {
  await page.getByRole('button', { name: 'Last 7 days' }).click();
  const panel = page.getByRole('complementary', { name: 'Last 7 days' });
  await expect(panel.getByRole('table')).toBeVisible();
  return panel;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function boxOf(locator: Locator, what: string): Promise<Box> {
  const box = await locator.boundingBox();
  expect(box, `${what} must be on the page`).not.toBeNull();
  return box!;
}

/** True when `inner` lies inside `outer` (one pixel of tolerance for rounding). */
export function inside(inner: Box, outer: Box): boolean {
  return (
    inner.x >= outer.x - 1 &&
    inner.y >= outer.y - 1 &&
    inner.x + inner.width <= outer.x + outer.width + 1 &&
    inner.y + inner.height <= outer.y + outer.height + 1
  );
}

/** Collects uncaught page errors (for example a TypeError that blanks the page). */
export function collectPageErrors(page: Page): Error[] {
  const errors: Error[] = [];
  page.on('pageerror', (error) => errors.push(error));
  return errors;
}

/** Waits until the browser has rendered at least two more frames. */
export async function settle(page: Page): Promise<void> {
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  );
}
