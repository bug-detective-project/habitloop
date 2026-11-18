# Solution: The streak counts the days, whatever their order

**Root cause.** `currentStreak` (`client/src/streak.ts`) assumed that `days` is sorted, oldest first, and walked it from the end. That holds for what the server sends, but when the user marks a day the app adds it to the end of the list (`toggleDay` in `client/src/HabitsContext.tsx`). After marking yesterday the list ends with yesterday, the function expects today there, and returns 0.

## Step by step

1. **See the order.** In React DevTools, mark yesterday and look at `days` in the card: the new day is the last item, after today.
2. **Ask which days are marked, not where they are.**

   ```ts
   export function currentStreak(days: string[], today: string): number {
     const marked = new Set(days);
     let day = marked.has(today) ? today : addDays(today, -1);
     let streak = 0;
     while (marked.has(day)) {
       streak += 1;
       day = addDays(day, -1);
     }
     return streak;
   }
   ```
3. **Add regression tests.** The reference adds `client/src/streak.order.test.ts` (days in any order, a day repeated) and `client/src/components/WeekPanel.streak.test.tsx` (marking yesterday in the panel).

Then run `npm test`, fill a gap in **Last 7 days** in the browser, and move the card to **In QA**.
