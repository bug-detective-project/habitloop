# Code review: HL-108, the progress ring of the habit card

A small component is a good place to practice the three questions of any component: what does it receive, what does it show, and what does it say to someone who cannot see it. Here is the reference approach, so you can compare it with yours.

## What this ticket was about

- The data was already on the card. What was missing was a piece that turns two numbers into something read at a glance.
- A drawing alone says nothing to a screen reader, so the ticket asked for a role, a name and a value.
- The edges matter as much as the middle: a week without a day, a goal reached and more days than the goal.

## Why the reference is built this way

- The component gets plain numbers and a label. It knows nothing about habits, so it can be tested alone and reused.
- The percentage is computed once and used for the attribute, the text and the drawing, so the three can never disagree.
- The SVG and the text are `aria-hidden`: the progress bar is announced once, not three times.
- Colors and sizes come from the theme, like every other component.

## Compare with what you built

- Did you use the `<progress>` element? It has the right role for free; it is hard to draw as a ring, which is why the reference uses a `div` with the role.
- Did you pass the percentage as a prop instead of `done` and `goal`? Then every caller has to round and cap it.
- Did you draw the ring with a `conic-gradient`? It works and needs no SVG; check that the text in the middle keeps enough contrast.
- Did you render the ring for a habit without a goal, at 0%? The ticket asked for no ring there: 0% would say the member is behind on a goal that does not exist.

## Watch for next time

- Write the props of a component before its markup: they are its contract.
- For anything drawn, ask what a screen reader should say, and test the smallest and the largest value.
