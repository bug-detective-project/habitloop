/** Days are plain texts, YYYY-MM-DD, as the API sends them. */
export function addDays(day: string, amount: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

/** The seven days that end on `today`, oldest first. */
export function getWeek(today: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDays(today, index - 6));
}

const WEEKDAY = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' });
const LONG = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });

/** "Wed" for a day. */
export function weekdayName(day: string): string {
  return WEEKDAY.format(new Date(`${day}T00:00:00Z`));
}

/** "Wednesday, March 18" for a day. */
export function longDay(day: string): string {
  return LONG.format(new Date(`${day}T00:00:00Z`));
}
