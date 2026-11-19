import { DEFAULT_DATABASE_PATH } from './db.ts';

export const port = Number(process.env.PORT ?? 3001);
export const databasePath = process.env.DATABASE_PATH ?? DEFAULT_DATABASE_PATH;

export interface Settings {
  /** How many active habits one installation may have. */
  maxHabits: number;
  /** A fixed "today" (YYYY-MM-DD) for tests and demos; without it the server uses the real date. */
  today?: string;
}

export const settings: Settings = {
  maxHabits: Number(process.env.MAX_HABITS ?? 20),
  today: process.env.HABITLOOP_TODAY || undefined,
};
