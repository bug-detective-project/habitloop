# Code review: HL-204, the summary counts days, not marks

The question behind every `COUNT` is "count of what?". Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- The table stores marks, and the screen talks about days. The query counted the unit of the table instead of the unit of the question.
- A join multiplies rows: one habit with three marks is three rows before the `GROUP BY`.
- With one device per member, a day has one mark and the two counts are equal. The bug needed two devices to show up.

## Why the reference fix is right

- `COUNT(DISTINCT c.day)` states the rule in the query itself: a day counts once.
- The count and the list of days now come from the same idea, so they cannot disagree.
- The data stays as it is: every mark is still recorded, which is useful to know when and where it was made.

## Compare with your fix

- Did you count in JavaScript, with the length of the list of days? It gives the right number; the query still computes a wrong one that someone will use later.
- Did you make the server refuse a second mark on the same day? The client said marking twice is allowed, and the rows that already exist would still count double.
- Did you add a unique index on habit and day? The same: it changes what can be saved, and existing duplicates would make the migration fail.

## Watch for next time

- When a number looks too high after a join, check how many rows the join produces per item.
- Before changing a query, run it by hand with the data that shows the problem.
