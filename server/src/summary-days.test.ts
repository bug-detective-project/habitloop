import { describe, expect, it } from 'vitest';
import type { Summary } from './repository.ts';
import { byName, testApi, TODAY } from './test/api.ts';

describe('the days of the summary', () => {
  it('counts a day once when the habit was marked twice on it', async () => {
    const { api } = testApi();
    const summary = (await api.get('/api/summary').expect(200)).body as Summary;

    // "Practice guitar" was marked twice yesterday and once today.
    expect(byName(summary.habits, 'Practice guitar')).toMatchObject({
      doneDays: 2,
      progress: '2 of 4 days',
      days: ['2026-03-17', TODAY],
    });
  });

  it('does not count a second mark of today as another day', async () => {
    const { api } = testApi();
    await api.post('/api/habits/3/checkins').send({ day: TODAY }).expect(204);
    await api.post('/api/habits/3/checkins').send({ day: TODAY }).expect(204);
    const summary = (await api.get('/api/summary').expect(200)).body as Summary;

    expect(byName(summary.habits, 'Morning walk').doneDays).toBe(3);
  });

  it('never counts more than the seven days of the summary', async () => {
    const { api } = testApi();
    for (let index = 0; index < 3; index += 1) {
      await api.post('/api/habits/1/checkins').send({ day: TODAY }).expect(204);
    }
    const summary = (await api.get('/api/summary').expect(200)).body as Summary;

    expect(byName(summary.habits, 'Drink eight glasses of water').doneDays).toBe(7);
  });
});
