# Solution: The summary counts days, not marks

**Root cause.** `checkins` has one row each time a habit is marked, and the same day may have several rows. The query of `weekSummary` (`server/src/repository.ts`) joined habits with their check-ins and used `COUNT(c.id)`: it counted marks. The list of days of the same summary uses `SELECT DISTINCT day`, so the squares were right and the number next to them was not.

## Step by step

1. **Ask the database.** `SELECT day, COUNT(*) FROM checkins WHERE habit_id = 5 GROUP BY day` (the first hint has a command that runs it) shows two marks for yesterday.
2. **Count each day once.** In the query of `weekSummary`:

   ```sql
   SELECT h.id, h.name, h.weekly_goal, COUNT(DISTINCT c.day) AS done_days
   FROM habits h
   LEFT JOIN checkins c ON c.habit_id = h.id AND c.day BETWEEN ? AND ?
   WHERE h.archived_at IS NULL
   GROUP BY h.id
   ORDER BY h.id
   ```
3. **Add a regression test.** The reference adds `server/src/summary-days.test.ts`: the habit of the sample that was marked twice, and a habit marked again today.

Then run `npm test`, look at the panel in the browser, and move the card to **In QA**.
