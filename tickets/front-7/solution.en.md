# Solution: A late answer of the refresh no longer undoes a new mark

**Root cause.** In `client/src/components/WeekPanel.tsx`, `load` put every answer of `/api/summary` on the screen, in the order the answers arrived. The periodic refresh may be asked before the user marks a day and answer after it. That answer describes the past, and it replaced the newer state: the mark vanished until the next refresh.

## Step by step

1. **Make it happen on demand.** With "Slow 4G" in the Network tab, mark a day while a request for the summary is pending.
2. **Number the requests and ignore the old ones.**

   ```ts
   // The number of the newest request. An answer is used only while its request is still the newest.
   const newestRef = useRef(0);

   const load = useCallback(async () => {
     const request = ++newestRef.current;
     try {
       const data = await fetchSummary();
       if (request === newestRef.current) {
         setSummary(data);
         setFailed(false);
       }
     } catch {
       if (request === newestRef.current) {
         setFailed(true);
       }
     }
   }, []);
   ```
3. **A change makes pending requests old.** In `toggle`, before changing the screen:

   ```ts
   // A request that is on its way was asked before this change: its answer is out of date.
   newestRef.current += 1;
   ```
4. **Add a regression test.** The reference adds `client/src/components/WeekPanel.stale.test.tsx`, which holds one answer of the summary, marks a day and then lets the old answer arrive.

Then run `npm test`, try again with the throttling on, and move the card to **In QA**.
