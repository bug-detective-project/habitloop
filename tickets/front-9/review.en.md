# Code review: HL-109, the month asks for its own days

Dates written by hand are one of the most common sources of bugs that look like something else. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- JavaScript's `Date` counts months from 0, and a date written as text (`YYYY-MM-DD`) counts them from 1. Putting one into the other without the `+ 1` moves every month one back.
- The title of the screen was made from the day itself (`monthName(anchor)`), so it was right, and the screen looked like it showed March. Only the request was off.
- In most months the wrong month is still a valid one, so nothing crashes: the numbers are just quietly wrong. January is the one month where it breaks loudly.

## Why the reference fix is right

- One `+ 1` where the month is written, or better, one helper (`monthStart`) that every screen uses to find the first day of a month.
- The last day is computed from the first, so fixing the first fixes both.
- The regression test checks the days on screen against the data, in more than one month and in January, where this kind of bug is loudest.

## Compare with your fix

- Did you use `monthStart(anchor)`? Then the month view and the date picker find months the same way, which is the most robust choice.
- Did you build the date with `new Date(year, month, 1)` and `toISOString()`? That reads the local time zone, and can move the day back again for players west of UTC.
- Did you add one to the month in the display instead? The request would still ask for the wrong days.

## Watch for next time

- When a date is written as text, write it in one place.
- Test date code on the edges: January, December, the last day of a month, a leap year.
