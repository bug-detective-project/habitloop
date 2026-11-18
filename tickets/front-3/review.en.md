# Code review: HL-103, marking a habit marks that habit only

Keys look like a detail React nags about, until a list reorders. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- With `key={index}`, "the first card" is always the same component instance, whatever habit it shows.
- State lives in the instance. When the instance got another habit, it kept the `done` of the previous one.
- The bug needs a list that changes order and a component with its own state. Either one alone hides it.

## Why the reference fix is right

- `habit.id` is stable and unique: the same habit has the same key in every render.
- Nothing else changes. The card may keep its own state, because now the state follows the habit.
- The reorder becomes cheaper too: React moves DOM nodes instead of rewriting every card.

## Compare with your fix

- Did you remove the `done` state from the card and read it from the list only? It also fixes the symptom; the index key would still bite the next state someone adds, such as the open form.
- Did you stop the list from reordering? The order is a feature the client asked for.
- Did you use `key={habit.name}`? Names can repeat and can be edited; ids cannot.

## Watch for next time

- Use the id of the item as key whenever a list can be reordered, filtered or have items added in the middle.
- When the screen and the server disagree, check the server first: it tells you on which side to look.
