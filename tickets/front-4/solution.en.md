# Solution: Edit opens the form without marking the habit

**Root cause.** In `client/src/components/HabitCard.tsx` the whole card is clickable: `<Card onClick={toggle}>` marks the habit. The **Edit** button is a child of that card. A click on the button runs the button's handler and then bubbles up to the card, which runs `toggle`. One click, two actions.

## Step by step

1. **See both handlers run.** With the Network tab open, click **Edit**: the form opens and a request to `/api/habits/:id/checkins` is sent.
2. **Stop the click at the button.**

   ```tsx
   <EditButton
     type="button"
     aria-label={`Edit ${habit.name}`}
     onClick={(event) => {
       // The whole card marks the habit; a click on Edit must not reach it.
       event.stopPropagation();
       setEditing(true);
     }}
   >
   ```
3. **Add a regression test.** The reference adds `client/src/components/HabitCard.edit.test.tsx`: Edit sends no request for a day, and a click elsewhere on the card still marks the habit.

Then run `npm test`, try Edit on a done and on a not done habit, and move the card to **In QA**.
