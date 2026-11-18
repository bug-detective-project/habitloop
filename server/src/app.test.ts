import { describe, expect, it } from 'vitest';
import type { Habit, Summary } from './repository.ts';
import { byName, testApi, TODAY } from './test/api.ts';

describe('the API', () => {
  it('answers only local hosts', async () => {
    const { api } = testApi();
    await api.get('/api/today').set('Host', 'evil.example').expect(403);
    await api.get('/api/today').set('Host', 'localhost:3001').expect(200);
  });

  it('tells the date it calls today', async () => {
    const { api } = testApi();
    const response = await api.get('/api/today').expect(200);
    expect(response.body).toEqual({ today: TODAY });
  });

  it('answers 404 to an unknown route', async () => {
    const { api } = testApi();
    await api.get('/api/nothing').expect(404);
  });
});

describe('habits', () => {
  it('lists the active habits with their marked days, oldest first', async () => {
    const { api } = testApi();
    const habits = (await api.get('/api/habits').expect(200)).body as Habit[];
    expect(habits).toHaveLength(8);
    expect(byName(habits, 'Read 10 pages')).toMatchObject({
      weeklyGoal: 5,
      days: ['2026-03-14', '2026-03-15', '2026-03-16', '2026-03-18'],
    });
  });

  it('creates a habit and answers the new list', async () => {
    const { api } = testApi();
    const response = await api.post('/api/habits').send({ name: '  Floss  ', weeklyGoal: 7 }).expect(201);
    expect(byName(response.body as Habit[], 'Floss')).toMatchObject({ weeklyGoal: 7, days: [] });
  });

  it('creates a habit without a weekly goal', async () => {
    const { api } = testApi();
    const response = await api.post('/api/habits').send({ name: 'Nap' }).expect(201);
    expect(byName(response.body as Habit[], 'Nap').weeklyGoal).toBeNull();
  });

  it('changes the name and the goal of a habit', async () => {
    const { api } = testApi();
    const response = await api.patch('/api/habits/3').send({ name: 'Evening walk', weeklyGoal: 4 }).expect(200);
    expect(byName(response.body as Habit[], 'Evening walk')).toMatchObject({ id: 3, weeklyGoal: 4 });
  });

  it('answers 404 for a habit that does not exist', async () => {
    const { api } = testApi();
    await api.patch('/api/habits/999').send({ name: 'Ghost' }).expect(404);
    await api.post('/api/habits/999/checkins').send({ day: TODAY }).expect(404);
  });

  it('refuses a goal outside 1 to 7', async () => {
    const { api } = testApi();
    const response = await api.patch('/api/habits/3').send({ name: 'Run', weeklyGoal: 9 }).expect(400);
    expect((response.body as { fields: Record<string, string> }).fields).toHaveProperty('weeklyGoal');
  });
});

describe('marking days', () => {
  it('marks and unmarks a day', async () => {
    const { api } = testApi();
    await api.post('/api/habits/3/checkins').send({ day: TODAY }).expect(204);
    let habits = (await api.get('/api/habits')).body as Habit[];
    expect(byName(habits, 'Morning walk').days).toContain(TODAY);

    await api.delete(`/api/habits/3/checkins/${TODAY}`).expect(204);
    habits = (await api.get('/api/habits')).body as Habit[];
    expect(byName(habits, 'Morning walk').days).not.toContain(TODAY);
  });

  it('refuses a day in the future and a text that is not a day', async () => {
    const { api } = testApi();
    await api.post('/api/habits/3/checkins').send({ day: '2026-03-19' }).expect(400);
    await api.post('/api/habits/3/checkins').send({ day: 'tomorrow' }).expect(400);
  });
});

describe('the summary', () => {
  it('covers the seven days that end today', async () => {
    const { api } = testApi();
    const summary = (await api.get('/api/summary').expect(200)).body as Summary;
    expect(summary.days).toHaveLength(7);
    expect(summary.days[0]).toBe('2026-03-12');
    expect(summary.days[6]).toBe(TODAY);
  });

  it('counts the days of each habit against its goal', async () => {
    const { api } = testApi();
    const summary = (await api.get('/api/summary').expect(200)).body as Summary;
    expect(byName(summary.habits, 'Read 10 pages')).toMatchObject({
      doneDays: 4,
      progress: '4 of 5 days',
      days: ['2026-03-14', '2026-03-15', '2026-03-16', '2026-03-18'],
    });
    expect(byName(summary.habits, 'No sugar after dinner')).toMatchObject({ doneDays: 0, progress: '0 of 6 days' });
  });
});
