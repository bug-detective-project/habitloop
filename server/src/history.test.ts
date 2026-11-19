import { describe, expect, it } from 'vitest';
import { addDays } from './dates.ts';
import type { Habit, History, Summary } from './repository.ts';
import { byName, testApi, TODAY } from './test/api.ts';

const ago = (days: number) => addDays(TODAY, -days);

describe('the history', () => {
  it('answers the marked days of every habit between two days, and when each habit started', async () => {
    const { api } = testApi();
    const history = (await api.get(`/api/history?from=${ago(6)}&to=${TODAY}`).expect(200)).body as History;

    expect(history).toMatchObject({ from: ago(6), to: TODAY });
    expect(history.habits).toHaveLength(8);
    expect(byName(history.habits, 'Read 10 pages')).toEqual({
      id: 2,
      name: 'Read 10 pages',
      weeklyGoal: 5,
      startedOn: ago(95),
      days: [ago(4), ago(3), ago(2), TODAY],
    });
  });

  it('goes back months, to the day each habit started and no further', async () => {
    const { api } = testApi();
    const history = (await api.get(`/api/history?from=${ago(200)}&to=${TODAY}`).expect(200)).body as History;

    for (const habit of history.habits) {
      expect(habit.days.length).toBeGreaterThan(0);
      expect(habit.days[0]! >= habit.startedOn).toBe(true);
    }
    const water = byName(history.habits, 'Drink eight glasses of water');
    expect(water.startedOn).toBe(ago(120));
    expect(water.days.filter((day) => day < ago(30)).length).toBeGreaterThan(20);
  });

  it('keeps the recent sample days as they were, so streaks and this week do not change', async () => {
    const { api } = testApi();
    const history = (await api.get(`/api/history?from=${ago(16)}&to=${TODAY}`).expect(200)).body as History;

    expect(byName(history.habits, 'Drink eight glasses of water').days).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(ago));
    expect(byName(history.habits, 'Stretch').days).toEqual([ago(15), ago(3)]);
    expect(byName(history.habits, 'No sugar after dinner').days).toEqual([12, 11, 10, 9, 8].map(ago));
  });

  it('answers one habit when asked for it', async () => {
    const { api } = testApi();
    const history = (await api.get(`/api/history?from=${ago(6)}&to=${TODAY}&habit=5`).expect(200)).body as History;

    expect(history.habits.map((habit) => habit.name)).toEqual(['Practice guitar']);
    // Marked twice yesterday, listed once.
    expect(history.habits[0]!.days).toEqual([ago(1), TODAY]);
  });

  it('starts a habit on its first marked day when that is before the day it was created', async () => {
    const { api } = testApi();
    await api.post('/api/habits').send({ name: 'Floss', weeklyGoal: 7 }).expect(201);
    const floss = byName((await api.get('/api/habits')).body as Habit[], 'Floss');
    await api.post(`/api/habits/${floss.id}/checkins`).send({ day: ago(3) }).expect(204);

    const history = (await api.get(`/api/history?from=${ago(6)}&to=${TODAY}&habit=${floss.id}`).expect(200)).body as History;

    expect(history.habits[0]).toMatchObject({ startedOn: ago(3), days: [ago(3)] });
  });

  it.each([
    ['no days', ''],
    ['a day that is not a date', `?from=2026-02-30&to=${TODAY}`],
    ['the first day after the last', `?from=${TODAY}&to=${ago(1)}`],
    ['more than a year', `?from=${ago(400)}&to=${TODAY}`],
  ])('refuses %s', async (_case, query) => {
    const { api } = testApi();
    await api.get(`/api/history${query}`).expect(400);
  });

  it('answers 404 for a habit that does not exist', async () => {
    const { api } = testApi();
    await api.get(`/api/history?from=${ago(6)}&to=${TODAY}&habit=999`).expect(404);
  });
});

describe('the habits and the summary for the history', () => {
  it('tells when each habit started in the list of habits', async () => {
    const { api } = testApi();
    const habits = (await api.get('/api/habits').expect(200)).body as Habit[];

    expect(byName(habits, 'Call a friend').startedOn).toBe(ago(110));
  });

  it('answers the summary of the seven days that end on an earlier day', async () => {
    const { api } = testApi();
    const summary = (await api.get(`/api/summary?end=${ago(7)}`).expect(200)).body as Summary;

    expect(summary.days[0]).toBe(ago(13));
    expect(summary.days[6]).toBe(ago(7));
    expect(byName(summary.habits, 'No sugar after dinner')).toMatchObject({ days: [12, 11, 10, 9, 8].map(ago), doneDays: 5 });
  });

  it.each([
    ['a day that is not a date', 'yesterday'],
    ['a day in the future', addDays(TODAY, 1)],
  ])('refuses a summary that ends on %s', async (_case, end) => {
    const { api } = testApi();
    await api.get(`/api/summary?end=${end}`).expect(400);
  });
});
