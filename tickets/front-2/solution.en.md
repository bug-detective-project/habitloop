# Solution: The Today list opens for a member without habits

**Root cause.** `Today` (`client/src/components/Today.tsx`) computes the line "Longest streak" with `bestStreak`, which ends in a `reduce` without a starting value. On an empty array that `reduce` throws `TypeError: Reduce of empty array with no initial value`. The error happens while React renders, nothing catches it, and React removes the whole app from the page. The "No habits yet" block is further down in the same component, so it is never reached.

## Step by step

1. **Read the error.** Reproduce with the Console open: the message names `reduce` and the stack points at `bestStreak` in `Today.tsx`.
2. **Handle the empty list first.** At the top of `Today`, return the empty state before anything that needs a habit:

   ```tsx
   if (habits.length === 0) {
     return (
       <Section aria-labelledby="today-heading">
         <Heading id="today-heading">{longDay(today)}</Heading>
         <Empty>
           <strong>No habits yet</strong>
           <Lead>Create your first habit with the New habit button.</Lead>
         </Empty>
       </Section>
     );
   }
   ```
3. **Simplify what follows.** With the guard in place, the list below no longer needs its own `habits.length === 0 ? … : …`.
4. **Add a regression test.** The reference adds `client/src/components/Today.empty.test.tsx`: the app with no habits shows the invitation, and the first habit shows up after it is created.

Then run `npm test`, archive every habit in the browser to see the empty page, and move the card to **In QA**.
