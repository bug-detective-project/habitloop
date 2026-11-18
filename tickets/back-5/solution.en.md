# Solution: The endpoint that archives a habit

**What was missing.** The screen and the database were ready for archiving: the button, the client call and the column `archived_at` existed, and every query already skipped archived habits. The route `POST /api/habits/:id/archive` and the function that sets the column were missing.

## Step by step

1. **Write the change in the repository.** In `server/src/repository.ts`:

   ```ts
   /** Takes the habit out of the lists. Its history stays in the database. */
   export function archiveHabit(db: Db, id: number): void {
     db.prepare('UPDATE habits SET archived_at = ? WHERE id = ?').run(new Date().toISOString(), id);
   }
   ```
2. **Add the route.** In `server/src/routes/habits.ts`, import `archiveHabit` and add:

   ```ts
   router.post('/:id/archive', (req, res) => {
     const id = habitId(req, res);
     if (id === undefined) {
       return;
     }
     archiveHabit(db, id);
     res.json(listHabits(db, options.today()));
   });
   ```
3. **Check what came for free.** `habitId` answers 404 for a habit that does not exist or is archived, and the lists, the summary and `countActiveHabits` already filter by `archived_at IS NULL`.
4. **Add the tests.** The reference adds `server/src/archive.test.ts`: the answer, the lists, the history kept in the database and the 404s.

Then run `npm test`, archive a habit in the browser, and move the card to **In QA**.
