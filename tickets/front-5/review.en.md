# Code review: HL-105, the streak counts the days, whatever their order

The function was right for the data it was written against, and wrong for the data the app really has. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- The function relied on an order that nothing guaranteed. The server sorts; the screen appends.
- Every test of the function used sorted days, so the assumption was never checked.
- A reload hid it: fresh data from the server is sorted again.

## Why the reference fix is right

- A `Set` makes the function independent of order and of repeated days.
- It starts from today, or from yesterday when today is not marked yet, and walks back one day at a time: the code reads like the rule.
- The function stays pure: it gets the days and today, and returns a number.

## Compare with your fix

- Did you sort the days inside `currentStreak` before walking them? It works; remember that a repeated day would still stop the walk.
- Did you keep the list sorted in `toggleDay` instead? It fixes this path, and the function still breaks for the next caller that passes unsorted days.
- Did you reload the habits from the server after each change? It hides the bug behind a request and makes the screen slower.

## Watch for next time

- When a function needs its input in some order, either sort inside it or do not depend on the order.
- Test with the data the app produces, not only with the data that is easy to write.
