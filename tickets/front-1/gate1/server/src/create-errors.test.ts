import { describe, expect, it } from 'vitest';
import type { Habit } from './repository.ts';
import { testApi } from './test/api.ts';

interface Refusal {
  error: string;
  fields: Record<string, string>;
}

describe('creating a habit that cannot be saved', () => {
  it('answers 400 and names the field when the name is empty', async () => {
    const { api } = testApi();
    const response = await api.post('/api/habits').send({ name: '   ' }).expect(400);

    expect((response.body as Refusal).error).toBe('Give the habit a name');
    expect((response.body as Refusal).fields).toHaveProperty('name');
  });

  it('answers 400 when the name is too long', async () => {
    const { api } = testApi();
    const response = await api.post('/api/habits').send({ name: 'x'.repeat(81) }).expect(400);

    expect((response.body as Refusal).error).toContain('80 characters');
  });

  it('answers 400 when the goal is not a number of days from 1 to 7', async () => {
    const { api } = testApi();
    const response = await api.post('/api/habits').send({ name: 'Run', weeklyGoal: 0 }).expect(400);

    expect((response.body as Refusal).fields).toHaveProperty('weeklyGoal');
  });

  it('saves nothing and keeps the list as it was', async () => {
    const { api } = testApi();
    await api.post('/api/habits').send({ name: '' });

    const habits = (await api.get('/api/habits').expect(200)).body as Habit[];
    expect(habits).toHaveLength(8);
  });
});
