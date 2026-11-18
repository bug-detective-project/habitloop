import { rmSync } from 'node:fs';
import { databasePath, settings } from '../config.ts';
import { systemToday } from '../dates.ts';
import { openDatabase, seedDatabase } from '../db.ts';

for (const suffix of ['', '-journal', '-wal', '-shm']) {
  rmSync(databasePath + suffix, { force: true });
}

const db = openDatabase(databasePath);
seedDatabase(db, settings.today ?? systemToday());
db.close();

console.log(`Database reset: ${databasePath}`);
