# HL-105: The streak drops to zero when yesterday is marked

| Field | Value |
| --- | --- |
| Project | HabitLoop (HL) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Nora Lindqvist (Head coach) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Today (streak) |
| Labels | `streak`, `last-7-days` |
| Sprint | HL Sprint 4 |
| Created | 17/03/2026 10:05 |

## Description

Members who forget to mark a habit can fill the day later in **Last 7 days**. When they do it, the streak on the card goes to "No streak yet" instead of growing. After a reload the streak is right.

Example from my account: "Read 10 pages" was done on the 14th, 15th, 16th and today, the 18th. The card says "1 day in a row". I mark the 17th in the panel and expect 5 days. The card says "No streak yet".

## Steps to reproduce

1. Open HabitLoop and find a habit that is done today and was not done yesterday.
2. Open **Last 7 days** and mark yesterday for that habit.
3. Look at the streak on the card of the habit.

## Expected result

The streak counts yesterday too: today, yesterday and every day in a row before them.

## Actual result

The streak becomes "No streak yet". Reloading the page shows the right number.

## Acceptance criteria

- [ ] Marking yesterday on a habit done today joins the streak with the days before.
- [ ] The streak on the screen is the same before and after a reload.
- [ ] An earlier day also extends a streak that ends yesterday.
- [ ] Unmarking a day in the middle still cuts the streak.

## Environment

- HabitLoop 1.0, Chrome
- Only until the page is reloaded

## Activity

**Nora Lindqvist** · 17/03/2026 10:26
> The streak is the number members care about most. Seeing it vanish makes them think they lost it.
