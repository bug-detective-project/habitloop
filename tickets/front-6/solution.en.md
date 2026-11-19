# Solution: The week stops its refresh when it leaves the screen

**Root cause.** In `client/src/components/WeekPanel.tsx`, the effect that starts the refresh calls `setInterval` and returns nothing. When the week leaves the screen React removes the component, and the interval, which belongs to the browser and not to React, keeps firing and calling `load()`. Each time the week is opened a new interval is added to the ones already running.

## Step by step

1. **Count the requests.** With the Network tab open, open the week of the history and leave it a few times, and watch `/api/summary`.
2. **Return a cleanup from the effect.**

   ```ts
   useEffect(() => {
     void load();
     const timer = setInterval(() => void load(), REFRESH_MS);
     return () => clearInterval(timer);
   }, [load]);
   ```

   React runs the returned function when the week leaves the page.
3. **Add a regression test.** The reference adds `client/src/components/WeekPanel.polling.test.tsx`: with the clock of the test, the week asks every 10 seconds while it is on the screen and stops once it leaves.

Then run `npm test`, watch the Network tab after leaving the week, and move the card to **In QA**.
