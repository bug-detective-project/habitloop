# Solution: The panel stops its refresh when it is closed

**Root cause.** In `client/src/components/WeekPanel.tsx`, the effect that starts the refresh calls `setInterval` and returns nothing. When the panel is closed React removes the component, and the interval, which belongs to the browser and not to React, keeps firing and calling `load()`. Each time the panel is opened a new interval is added to the ones already running.

## Step by step

1. **Count the requests.** With the Network tab open, open and close the panel a few times and watch `/api/summary`.
2. **Return a cleanup from the effect.**

   ```ts
   useEffect(() => {
     void load();
     const timer = setInterval(() => void load(), REFRESH_MS);
     return () => clearInterval(timer);
   }, [load]);
   ```

   React runs the returned function when the panel leaves the page.
3. **Add a regression test.** The reference adds `client/src/components/WeekPanel.polling.test.tsx`: with the clock of the test, the panel asks every 10 seconds while open and stops once closed.

Then run `npm test`, watch the Network tab with the panel closed, and move the card to **In QA**.
