# Solution: Marking a habit marks that habit only

**Root cause.** `Today` (`client/src/components/Today.tsx`) renders the cards with `key={index}`. A key tells React which component instance belongs to which item. With the position as key, when a marked habit moves down React keeps the instance at position 0 and gives it the next habit as props. `HabitCard` keeps `done` in its own state, and that state stays with the instance: the next habit inherits "done".

## Step by step

1. **Confirm that the data is right.** After marking one habit, `GET /api/habits` shows one new day. The problem is only on the screen.
2. **Use a key that identifies the habit.** In the `map` of `Today`:

   ```tsx
   {[...pending, ...done].map((habit) => (
     <HabitCard key={habit.id} habit={habit} />
   ))}
   ```

   Now React moves the card together with its habit, and its state goes along.
3. **Add a regression test.** The reference adds `client/src/components/Today.keys.test.tsx`: after marking the first habit, the others keep their state.

Then run `npm test`, mark and unmark a few habits in the browser, and move the card to **In QA**.
