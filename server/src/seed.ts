import { addDays } from './dates.ts';

export interface SeedHabit {
  id: number;
  name: string;
  weeklyGoal: number | null;
  createdAt: string;
  /** One entry per time the habit was marked; a day may appear twice. */
  checkins: string[];
}

/** The first day of the older history: day 16 stays empty, so it never joins the recent days. */
const OLDER_FROM = 17;

/**
 * The months before the recent days, from the day the habit started: marked on about as many days
 * as its goal asks (three a week without a goal), the same way on every run.
 */
function olderHistory(id: number, weeklyGoal: number | null, startedAgo: number): number[] {
  const share = ((weeklyGoal ?? 3) / 7) * 0.85;
  const days: number[] = [];
  for (let day = startedAgo; day >= OLDER_FROM; day -= 1) {
    if (((id * 7919 + day * 104729) % 100) / 100 < share) {
      days.push(day);
    }
  }
  return days;
}

/**
 * The sample habits. Their history is written in days before `today` (0 is today, 1 is yesterday),
 * so the app looks alive on whatever day it is opened. The recent days (the last 16) are written by
 * hand, because the streaks and the week of the screen show them; the months before are made by
 * `olderHistory`, for the history screen.
 */
export function seedHabits(today: string): SeedHabit[] {
  const ago = (...days: number[]) => days.map((day) => addDays(today, -day));
  const habit = (id: number, name: string, weeklyGoal: number | null, startedAgo: number, recent: number[]): SeedHabit => ({
    id,
    name,
    weeklyGoal,
    createdAt: `${addDays(today, -startedAgo)}T09:00:00.000Z`,
    checkins: [...ago(...olderHistory(id, weeklyGoal, startedAgo)), ...ago(...recent)],
  });

  return [
    habit(1, 'Drink eight glasses of water', 7, 120, [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]),
    habit(2, 'Read 10 pages', 5, 95, [4, 3, 2, 0]),
    habit(3, 'Morning walk', 3, 75, [12, 10, 2, 1]),
    habit(4, 'Stretch', null, 60, [15, 3]),
    // Marked twice yesterday: once on the phone, once on the computer.
    habit(5, 'Practice guitar', 4, 100, [8, 1, 1, 0]),
    habit(6, 'Write three things I am grateful for in the paper journal before going to bed', 7, 45, [5, 1]),
    habit(7, 'No sugar after dinner', 6, 80, [12, 11, 10, 9, 8]),
    habit(8, 'Call a friend', 1, 110, [13, 5]),
  ];
}
