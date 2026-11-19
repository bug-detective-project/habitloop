/** Days are plain texts, YYYY-MM-DD, everywhere: in the database, in the API and on the screen. */
const DAY = /^\d{4}-\d{2}-\d{2}$/;

export function isDay(value: unknown): value is string {
  if (typeof value !== 'string' || !DAY.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function addDays(day: string, amount: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

/** The date on the server's clock, in the server's time zone. */
export function systemToday(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** The seven days that end on `today`, oldest first. */
export function getWeek(today: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDays(today, index - 6));
}
