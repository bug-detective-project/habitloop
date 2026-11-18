import { describe, expect, it } from 'vitest';
import type { Habit } from './repository.ts';
import { testApi } from './test/api.ts';

describe('the limit of habits', () => {
  it('is the one of the settings, not a fixed number', async () => {
    // The sample has 8 habits: with a limit of 9 there is room for one more.
    const { api } = testApi({ maxHabits: 9 });

    await api.post('/api/habits').send({ name: 'Floss' }).expect(201);
    const response = await api.post('/api/habits').send({ name: 'Nap' }).expect(409);

    expect((response.body as { error: string }).error).toBe('You reached the limit of 9 habits. Archive one to add another.');
    expect((await api.get('/api/habits')).body as Habit[]).toHaveLength(9);
  });

  it('allows more habits when the settings say so', async () => {
    const { api } = testApi({ maxHabits: 30 });

    for (let index = 0; index < 15; index += 1) {
      await api.post('/api/habits').send({ name: `Habit ${index}` }).expect(201);
    }
    expect((await api.get('/api/habits')).body as Habit[]).toHaveLength(23);
  });
});
