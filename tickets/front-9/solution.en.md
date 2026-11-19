# Solution: The month asks for its own days

**Root cause.** In `client/src/components/History.tsx`, `periodOf` turns the month on screen into the days it asks the API for. It writes the first day as text from the parts of a `Date`: `${date.getUTCFullYear()}-${String(date.getUTCMonth()).padStart(2, '0')}-01`. `getUTCMonth()` counts from 0, so March (2) becomes `2026-02-01`: the screen asks for February while its title (made from the day itself) says March, and every day of the March calendar finds no mark. For January the month is 0, and `2026-00-01` is not a date: the API answers 400 and the history cannot be loaded.

## Step by step

1. **See what the screen asks for.** In the Network tab, Month of March asks `/api/history?from=2026-02-01&to=2026-02-28`; January asks `from=2026-00-01`, which the API refuses.
2. **Find where the day is written.** `periodOf`, case `'month'`, builds the first day from `getUTCFullYear()` and `getUTCMonth()`.
3. **Count the month from 1.** Write `String(date.getUTCMonth() + 1).padStart(2, '0')`, or use `monthStart(anchor)` from `client/src/dates.ts`, which already does it. The last day (`monthEnd`) follows from the first.
4. **Add a regression test.** The reference adds `client/src/History.month.test.tsx`: the counts of days of March and February, the summary of March, January, and one habit's month.

Then run `npm test`, open History → Month on a few months, and move the card to **In QA**.
