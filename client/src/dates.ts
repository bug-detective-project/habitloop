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

/** Every day from `from` to `to`, both included, oldest first. */
export function daysFrom(from: string, to: string): string[] {
  const days: string[] = [];
  for (let day = from; day <= to; day = addDays(day, 1)) {
    days.push(day);
  }
  return days;
}

/** The first day of the month of `day`, moved by `months` months. */
export function monthStart(day: string, months = 0): string {
  const date = new Date(`${day.slice(0, 7)}-01T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, 10);
}

/** The last day of the month of `day`. */
export function monthEnd(day: string): string {
  return addDays(monthStart(day, 1), -1);
}

/** 0 for a Monday, 6 for a Sunday: the column of the day in a calendar. */
export function weekdayColumn(day: string): number {
  return (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7;
}

const WEEKDAY = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' });
const SHORT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const FULL = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const MONTH = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const MEDIUM = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const SPOKEN = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** "Mar 2, 2026" for a day. */
export function mediumDay(day: string): string {
  return MEDIUM.format(new Date(`${day}T00:00:00Z`));
}

/** "Monday, March 2, 2026" for a day. */
export function spokenDay(day: string): string {
  return SPOKEN.format(new Date(`${day}T00:00:00Z`));
}

/** "Mar 2" for a day. */
export function shortDay(day: string): string {
  return SHORT.format(new Date(`${day}T00:00:00Z`));
}

/** "March 2, 2026" for a day. */
export function fullDay(day: string): string {
  return FULL.format(new Date(`${day}T00:00:00Z`));
}

/** "March 2026" for any day of the month. */
export function monthName(day: string): string {
  return MONTH.format(new Date(`${day}T00:00:00Z`));
}
const LONG = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });

/** "Wed" for a day. */
export function weekdayName(day: string): string {
  return WEEKDAY.format(new Date(`${day}T00:00:00Z`));
}

/** "Wednesday, March 18" for a day. */
export function longDay(day: string): string {
  return LONG.format(new Date(`${day}T00:00:00Z`));
}
