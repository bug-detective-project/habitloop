# Solution: A long habit name stays inside its card

**Root cause.** In `client/src/components/HabitCard.tsx` the card is a flex row and `Info` (the block with the name) is one of its items. A flex item has `min-width: auto`: it refuses to become narrower than its content. The name is `white-space: nowrap`, so the content is the whole name on one line; `Info` grows to that width and pushes the ring and the **Edit** button out of the card.

## Step by step

1. **See it in DevTools.** With a narrow window, select the block of the name in the long card: it is wider than the card itself.
2. **Let the block shrink.** Add `min-width: 0;` to `Info`:

   ```ts
   const Info = styled.div`
     flex: 1;
     min-width: 0;
   `;
   ```

   Now the block may be narrower than the name, and the `overflow: hidden` and `text-overflow: ellipsis` of `Name` show the "…".
3. **Add a regression test.** The reference adds `client/src/components/HabitCard.layout.test.tsx`, which checks that the block of the name is allowed to shrink.

Then run `npm test`, look at the card at a few window widths, and move the card to **In QA**.
