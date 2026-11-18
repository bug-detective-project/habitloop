# Code review: HL-102, the Today list opens for a member without habits

A white page looks dramatic, and the browser console usually names the line. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- `reduce` without a starting value uses the first item as the start. With no items there is nothing to start from, and it throws.
- An error thrown during render is not like a failed request: React cannot draw a half-rendered tree, so it removes everything.
- The empty state existed, but below the line that crashed. Nobody on the team had an account without habits, so nobody saw it.

## Why the reference fix is right

- The guard comes first: the component answers "what if there is nothing?" before it computes anything from the list.
- The rest of the component can then assume at least one habit, which keeps `bestStreak` simple.
- The header and the **New habit** button live outside `Today`, so they stay on the page either way.

## Compare with your fix

- Did you give `reduce` a starting value instead? It stops the crash; check what the "Longest streak" line says with no habits.
- Did you wrap the app in an error boundary? It helps the member see a message, but the empty list is not an error: it should work.
- Did you check `habits[0]` with `?.` in several places? One guard at the top is easier to read than many small ones.

## Watch for next time

- Try every list screen with zero items, one item and many items.
- When a page goes white, read the console before reading the code.
