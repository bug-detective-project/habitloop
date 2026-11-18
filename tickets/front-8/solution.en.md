# Solution: The progress ring of the habit card

**What was missing.** The card had the numbers (`week` and `habit.weeklyGoal`) and no component to draw them. `ProgressRing` did not exist, so `HabitCard` showed the week only as text.

## Step by step

1. **Compute the value.** In `client/src/components/ProgressRing.tsx`:

   ```ts
   const percent = Math.min(100, Math.round((done / goal) * 100));
   ```
2. **Say what it is.** The outer element is the progress bar; the drawing inside is decoration:

   ```tsx
   <Ring role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
     <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">…</svg>
     <Value aria-hidden="true">{percent}%</Value>
   </Ring>
   ```
3. **Draw it.** Two circles with the same radius: a track in the border color and a bar in the accent color with `strokeDasharray={CIRCUMFERENCE}` and `strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}`, rotated -90 degrees. `Ring` is `flex: none` with a fixed width and height.
4. **Use it in the card.** In `HabitCard`, between `Info` and `EditButton`:

   ```tsx
   {habit.weeklyGoal !== null && (
     <ProgressRing done={week} goal={habit.weeklyGoal} label={`Weekly goal of ${habit.name}`} />
   )}
   ```
5. **Add the tests.** The reference adds `client/src/components/ProgressRing.test.tsx`: the role and the values of the component, and the ring on the cards.

Then run `npm test`, look at the cards in the browser, and move the card to **In QA**.
