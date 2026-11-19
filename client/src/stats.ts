import type { HistoryHabit } from './api/habits.ts';
import { addDays, daysFrom } from './dates.ts';

export interface PeriodStats {
  /** The days of the period the habit could be done on: after it started, and not after today. */
  possible: number;
  done: number;
  /** Done days out of the possible ones, in percent; null when none was possible. */
  rate: number | null;
  /** The most days in a row it was done inside the period. */
  longestStreak: number;
}

/** How a habit went from `from` to `to`, counting only the days it existed and that are over or today. */
export function periodStats(habit: HistoryHabit, from: string, to: string, today: string): PeriodStats {
  const first = habit.startedOn > from ? habit.startedOn : from;
  const last = to < today ? to : today;
  const possible = first > last ? 0 : daysFrom(first, last).length;
  const marked = new Set(habit.days.filter((day) => day >= first && day <= last));

  let longestStreak = 0;
  let streak = 0;
  for (let day = from; day <= last; day = addDays(day, 1)) {
    streak = marked.has(day) ? streak + 1 : 0;
    longestStreak = Math.max(longestStreak, streak);
  }

  return {
    possible,
    done: marked.size,
    rate: possible === 0 ? null : Math.round((marked.size / possible) * 100),
    longestStreak,
  };
}
