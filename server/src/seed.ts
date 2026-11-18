import { addDays } from './dates.ts';

export interface SeedHabit {
  id: number;
  name: string;
  weeklyGoal: number | null;
  createdAt: string;
  /** One entry per time the habit was marked; a day may appear twice. */
  checkins: string[];
}

/**
 * The sample habits. Their history is written in days before `today` (0 is today, 1 is yesterday),
 * so the app looks alive on whatever day it is opened.
 */
export function seedHabits(today: string): SeedHabit[] {
  const ago = (...days: number[]) => days.map((day) => addDays(today, -day));
  const createdAt = `${addDays(today, -30)}T09:00:00.000Z`;

  return [
    { id: 1, name: 'Drink eight glasses of water', weeklyGoal: 7, createdAt, checkins: ago(9, 8, 7, 6, 5, 4, 3, 2, 1, 0) },
    { id: 2, name: 'Read 10 pages', weeklyGoal: 5, createdAt, checkins: ago(4, 3, 2, 0) },
    { id: 3, name: 'Morning walk', weeklyGoal: 3, createdAt, checkins: ago(12, 10, 2, 1) },
    { id: 4, name: 'Stretch', weeklyGoal: null, createdAt, checkins: ago(15, 3) },
    // Marked twice yesterday: once on the phone, once on the computer.
    { id: 5, name: 'Practice guitar', weeklyGoal: 4, createdAt, checkins: ago(8, 1, 1, 0) },
    {
      id: 6,
      name: 'Write three things I am grateful for in the paper journal before going to bed',
      weeklyGoal: 7,
      createdAt,
      checkins: ago(5, 1),
    },
    { id: 7, name: 'No sugar after dinner', weeklyGoal: 6, createdAt, checkins: ago(12, 11, 10, 9, 8) },
    { id: 8, name: 'Call a friend', weeklyGoal: 1, createdAt, checkins: ago(13, 5) },
  ];
}
