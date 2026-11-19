import type { Db } from './db.ts';
import { addDays, getWeek } from './dates.ts';
import type { HabitInput } from './validation.ts';

/** How far back the list of marked days goes. */
export const HISTORY_DAYS = 60;

export interface Habit {
  id: number;
  name: string;
  weeklyGoal: number | null;
  /** The day the habit started: the day it was created, or its first marked day when that is earlier. */
  startedOn: string;
  /** The marked days of the last HISTORY_DAYS days, each day once, oldest first. */
  days: string[];
}

export interface HistoryHabit {
  id: number;
  name: string;
  weeklyGoal: number | null;
  startedOn: string;
  /** The marked days between the first and the last day of the history, each day once, oldest first. */
  days: string[];
}

export interface History {
  from: string;
  to: string;
  habits: HistoryHabit[];
}

export interface SummaryRow {
  id: number;
  name: string;
  weeklyGoal: number | null;
  /** The marked days among the seven of the summary, oldest first. */
  days: string[];
  doneDays: number;
  /** The line the summary shows next to the habit, for example "3 of 5 days". */
  progress: string;
}

export interface Summary {
  /** The seven days of the summary, oldest first; the last one is today. */
  days: string[];
  habits: SummaryRow[];
}

interface HabitRow {
  id: number;
  name: string;
  weekly_goal: number | null;
}

interface HabitWithStart extends HabitRow {
  created_at: string;
  first_day: string | null;
}

/** The habits with what tells when they started; all the active ones, or only `habitId`. */
function habitsWithStart(db: Db, habitId?: number): HabitWithStart[] {
  const sql = `SELECT h.id, h.name, h.weekly_goal, h.created_at, MIN(c.day) AS first_day
     FROM habits h
     LEFT JOIN checkins c ON c.habit_id = h.id
     WHERE h.archived_at IS NULL ${habitId === undefined ? '' : 'AND h.id = ?'}
     GROUP BY h.id
     ORDER BY h.id`;
  const statement = db.prepare(sql);
  return (habitId === undefined ? statement.all() : statement.all(habitId)) as HabitWithStart[];
}

function startedOn(row: HabitWithStart): string {
  const created = row.created_at.slice(0, 10);
  return row.first_day !== null && row.first_day < created ? row.first_day : created;
}

function markedDays(db: Db, habitId: number, from: string, to: string): string[] {
  const rows = db
    .prepare('SELECT DISTINCT day FROM checkins WHERE habit_id = ? AND day BETWEEN ? AND ? ORDER BY day')
    .all(habitId, from, to) as { day: string }[];
  return rows.map((row) => row.day);
}

export function listHabits(db: Db, today: string): Habit[] {
  return habitsWithStart(db).map((row) => ({
    id: row.id,
    name: row.name,
    weeklyGoal: row.weekly_goal,
    startedOn: startedOn(row),
    days: markedDays(db, row.id, addDays(today, -HISTORY_DAYS), today),
  }));
}

/** The marked days of the active habits (or only `habitId`) from `from` to `to`, both included. */
export function habitHistory(db: Db, from: string, to: string, habitId?: number): History {
  return {
    from,
    to,
    habits: habitsWithStart(db, habitId).map((row) => ({
      id: row.id,
      name: row.name,
      weeklyGoal: row.weekly_goal,
      startedOn: startedOn(row),
      days: markedDays(db, row.id, from, to),
    })),
  };
}

export function countActiveHabits(db: Db): number {
  const row = db.prepare('SELECT COUNT(*) AS count FROM habits WHERE archived_at IS NULL').get() as { count: number };
  return row.count;
}

/** True when there is an active habit with this id. */
export function habitExists(db: Db, id: number): boolean {
  return db.prepare('SELECT 1 FROM habits WHERE id = ? AND archived_at IS NULL').get(id) !== undefined;
}

export function createHabit(db: Db, input: HabitInput): void {
  db.prepare('INSERT INTO habits (name, weekly_goal, archived_at, created_at) VALUES (?, ?, NULL, ?)').run(
    input.name,
    input.weeklyGoal,
    new Date().toISOString(),
  );
}

export function updateHabit(db: Db, id: number, input: HabitInput): void {
  db.prepare('UPDATE habits SET name = ?, weekly_goal = ? WHERE id = ?').run(input.name, input.weeklyGoal, id);
}

/** Takes the habit out of the lists. Its history stays in the database. */
export function archiveHabit(db: Db, id: number): void {
  db.prepare('UPDATE habits SET archived_at = ? WHERE id = ?').run(new Date().toISOString(), id);
}

export function markDay(db: Db, habitId: number, day: string): void {
  db.prepare('INSERT INTO checkins (habit_id, day, created_at) VALUES (?, ?, ?)').run(
    habitId,
    day,
    new Date().toISOString(),
  );
}

export function unmarkDay(db: Db, habitId: number, day: string): void {
  db.prepare('DELETE FROM checkins WHERE habit_id = ? AND day = ?').run(habitId, day);
}

function progressLine(doneDays: number, weeklyGoal: number | null): string {
  const unit = doneDays === 1 ? 'day' : 'days';
  return weeklyGoal === null ? `${doneDays} ${unit}` : `${doneDays} of ${weeklyGoal} ${weeklyGoal === 1 ? 'day' : 'days'}`;
}

export function weekSummary(db: Db, today: string): Summary {
  const days = getWeek(today);
  const first = days[0]!;
  const rows = db
    .prepare(
      `SELECT h.id, h.name, h.weekly_goal, COUNT(c.id) AS done_days
       FROM habits h
       LEFT JOIN checkins c ON c.habit_id = h.id AND c.day BETWEEN ? AND ?
       WHERE h.archived_at IS NULL
       GROUP BY h.id
       ORDER BY h.id`,
    )
    .all(first, today) as (HabitRow & { done_days: number })[];

  return {
    days,
    habits: rows.map((row) => ({
      id: row.id,
      name: row.name,
      weeklyGoal: row.weekly_goal,
      days: markedDays(db, row.id, first, today),
      doneDays: row.done_days,
      progress: progressLine(row.done_days, row.weekly_goal),
    })),
  };
}
