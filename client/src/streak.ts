import { addDays } from './dates.ts';

/**
 * How many days in a row the habit was done, counting back from today. A day that is not over yet
 * does not break a streak: when today is not marked, the count starts from yesterday.
 */
export function currentStreak(days: string[], today: string): number {
  // The newest day is the last one of the list: walk back from it while the days are in a row.
  let day = days.includes(today) ? today : addDays(today, -1);
  let streak = 0;
  for (let index = days.length - 1; index >= 0 && days[index] === day; index -= 1) {
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
