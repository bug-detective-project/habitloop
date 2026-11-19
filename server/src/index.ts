import { createApp } from './app.ts';
import { databasePath, port, settings } from './config.ts';
import { systemToday } from './dates.ts';
import { isEmpty, openDatabase, seedDatabase } from './db.ts';

const db = openDatabase(databasePath);
if (isEmpty(db)) {
  seedDatabase(db, settings.today ?? systemToday());
}

const app = createApp(db, settings);

app.listen(port, () => {
  console.log(`HabitLoop API listening on http://localhost:${port}`);
});
