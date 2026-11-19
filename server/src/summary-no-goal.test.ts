import { describe, expect, it } from 'vitest';
import type { Summary } from './repository.ts';
import { byName, testApi } from './test/api.ts';

describe('the progress line of a habit without a weekly goal', () => {
  it('says only how many days were done', async () => {
    const { api } = testApi();
    const summary = (await api.get('/api/summary').expect(200)).body as Summary;

    expect(byName(summary.habits, 'Stretch')).toMatchObject({ weeklyGoal: null, doneDays: 1, progress: '1 day' });
  });

  it('says "0 days" for a new habit without a goal', async () => {
    const { api } = testApi();
    await api.post('/api/habits').send({ name: 'Nap' }).expect(201);
    const summary = (await api.get('/api/summary').expect(200)).body as Summary;

    expect(byName(summary.habits, 'Nap').progress).toBe('0 days');
  });

  it('keeps the goal in the line of a habit that has one', async () => {
    const { api } = testApi();
    const summary = (await api.get('/api/summary').expect(200)).body as Summary;

    expect(byName(summary.habits, 'Morning walk').progress).toBe('2 of 3 days');
    expect(byName(summary.habits, 'Call a friend').progress).toBe('1 of 1 day');
  });
});
