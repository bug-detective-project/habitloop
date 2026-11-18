import request from 'supertest';
import { createApp } from '../app.ts';
import type { Settings } from '../config.ts';
import { openDatabase, seedDatabase } from '../db.ts';
import type { Db } from '../db.ts';

/** The day every server test calls today: a Wednesday in the middle of a month. */
export const TODAY = '2026-03-18';

export interface TestApi {
  db: Db;
  /** A supertest agent that sends the Host the API accepts. */
  api: ReturnType<typeof request>;
}

/** A fresh in-memory database with the sample habits, and the app on top of it. */
export function testApi(overrides: Partial<Settings> = {}): TestApi {
  const db = openDatabase(':memory:');
  seedDatabase(db, TODAY);
  const app = createApp(db, { maxHabits: 20, today: TODAY, ...overrides });
  return { db, api: request(app) };
}

interface Named {
  name: string;
}

/** The item with this name in a list the API answered. */
export function byName<T extends Named>(items: T[], name: string): T {
  const found = items.find((item) => item.name === name);
  if (!found) {
    throw new Error(`No item named "${name}"`);
  }
  return found;
}
