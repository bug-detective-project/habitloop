import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { seedHabits } from './seed.ts';

export type Db = Database.Database;

export const DEFAULT_DATABASE_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '../data/habitloop.db');

const schema = `
  CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    weekly_goal INTEGER CHECK (weekly_goal BETWEEN 1 AND 7),
    archived_at TEXT,
    created_at TEXT NOT NULL
  );

  -- One row each time a habit is marked. The same day may have more than one row (the phone and
  -- the computer both marked it); what counts is the day.
  CREATE TABLE IF NOT EXISTS checkins (
    id INTEGER PRIMARY KEY,
    habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    day TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS checkins_habit_day ON checkins (habit_id, day);
`;

export function openDatabase(path: string): Db {
  if (path !== ':memory:') {
    mkdirSync(dirname(path), { recursive: true });
  }
  const db = new Database(path);
  db.pragma('foreign_keys = ON');
  db.exec(schema);
  return db;
}

/** Empties the database and puts the sample habits back, with a history that ends on `today`. */
export function seedDatabase(db: Db, today: string): void {
  const insertHabit = db.prepare(
    'INSERT INTO habits (id, name, weekly_goal, archived_at, created_at) VALUES (@id, @name, @weeklyGoal, NULL, @createdAt)',
  );
  const insertCheckin = db.prepare(
    'INSERT INTO checkins (habit_id, day, created_at) VALUES (@habitId, @day, @createdAt)',
  );

  db.transaction(() => {
    db.exec('DELETE FROM checkins; DELETE FROM habits;');
    for (const habit of seedHabits(today)) {
      insertHabit.run({ id: habit.id, name: habit.name, weeklyGoal: habit.weeklyGoal, createdAt: habit.createdAt });
      for (const day of habit.checkins) {
        insertCheckin.run({ habitId: habit.id, day, createdAt: `${day}T08:00:00.000Z` });
      }
    }
  })();
}

/** True for a database that never had a habit (a new installation). */
export function isEmpty(db: Db): boolean {
  const row = db.prepare('SELECT COUNT(*) AS count FROM habits').get() as { count: number };
  return row.count === 0;
}
