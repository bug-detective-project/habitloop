import { describe, expect, it } from 'vitest';
import type { Habit, Summary } from './repository.ts';
import { testApi } from './test/api.ts';

describe('POST /api/habits/:id/archive', () => {
  it('answers the list without the habit', async () => {
    const { api } = testApi();
    const response = await api.post('/api/habits/8/archive').expect(200);

    const habits = response.body as Habit[];
    expect(habits).toHaveLength(7);
    expect(habits.map((habit) => habit.name)).not.toContain('Call a friend');
  });

  it('takes the habit out of the list and of the summary', async () => {
    const { api } = testApi();
    await api.post('/api/habits/8/archive').expect(200);

    const habits = (await api.get('/api/habits').expect(200)).body as Habit[];
    const summary = (await api.get('/api/summary').expect(200)).body as Summary;
    expect(habits.map((habit) => habit.id)).not.toContain(8);
    expect(summary.habits.map((habit) => habit.id)).not.toContain(8);
  });

  it('keeps the history of the habit in the database', async () => {
    const { api, db } = testApi();
    await api.post('/api/habits/8/archive').expect(200);

    const habit = db.prepare('SELECT archived_at FROM habits WHERE id = 8').get() as { archived_at: string | null };
    const marks = db.prepare('SELECT COUNT(*) AS count FROM checkins WHERE habit_id = 8').get() as { count: number };
    expect(habit.archived_at).not.toBeNull();
    expect(marks.count).toBe(2);
  });

  it('answers 404 for a habit that does not exist or is already archived', async () => {
    const { api } = testApi();
    await api.post('/api/habits/999/archive').expect(404);
    await api.post('/api/habits/8/archive').expect(200);
    await api.post('/api/habits/8/archive').expect(404);
  });

  it('refuses changes to an archived habit', async () => {
    const { api } = testApi();
    await api.post('/api/habits/8/archive').expect(200);

    await api.patch('/api/habits/8').send({ name: 'Back again' }).expect(404);
    await api.post('/api/habits/8/checkins').send({ day: '2026-03-18' }).expect(404);
  });
});
