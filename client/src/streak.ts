import { addDays } from './dates.ts';

/**
 * How many days in a row the habit was done, counting back from today. A day that is not over yet
 * does not break a streak: when today is not marked, the count starts from yesterday.
 */
export function currentStreak(days: string[], today: string): number {
  const marked = new Set(days);
  let day = marked.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (marked.has(day)) {
    streak += 1;
    day = addDays(day, -1);
  }
  return streak;
}

/** How many of the seven days that end today are marked. */
export function doneThisWeek(days: string[], today: string): number {
  const first = addDays(today, -6);
  return new Set(days.filter((day) => day >= first && day <= today)).size;
}
