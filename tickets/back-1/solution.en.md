# Solution: The progress line of a habit without a goal

**Root cause.** `progressLine` in `server/src/repository.ts` builds the text with a template string: `${doneDays} of ${weeklyGoal} days`. Its parameter is `number | null`, because `weekly_goal` is a nullable column, and the function treated it as always a number. A template string turns `null` into the text "null".

## Step by step

1. **Look at the data.** `curl http://localhost:3001/api/summary`: the row of "Stretch" has `"weeklyGoal": null` and `"progress": "1 of null days"`.
2. **Write the line for both cases.**

   ```ts
   function progressLine(doneDays: number, weeklyGoal: number | null): string {
     const unit = doneDays === 1 ? 'day' : 'days';
     return weeklyGoal === null ? `${doneDays} ${unit}` : `${doneDays} of ${weeklyGoal} ${weeklyGoal === 1 ? 'day' : 'days'}`;
   }
   ```
3. **Add a regression test.** The reference adds `server/src/summary-no-goal.test.ts`: a habit without a goal, a new one with no days, and habits with a goal.

Then run `npm test`, look at the week of the history in the browser, and move the card to **In QA**.
