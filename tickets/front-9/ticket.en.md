# HL-109: The month of the history shows the marks of the month before

| Field | Value |
| --- | --- |
| Project | HabitLoop (HL) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Samuel Adeyemi (Member support) |
| Track | Front-end |
| Affects version | 1.1 |
| Component | History (month) |
| Labels | `history`, `month`, `dates` |
| Sprint | HL Sprint 4 |
| Created | 18/03/2026 10:40 |

## Description

Members love the new history, but the **Month** tab is confusing them. A member who marks her habits every day opened **History → Month**: the title says **March 2026**, and the calendar shows almost nothing done this month, while **Week** shows a week full of green.

I compared it with what the member told us: the numbers under the calendar look like February's, not March's. The **Done** column says "… of 28" for habits that started long ago, and March so far has 18 days. And when I went back to **January**, the month did not load at all: "The history could not be loaded."

## Steps to reproduce

1. Open HabitLoop and click **History**, then **Month**.
2. Compare the days of the calendar with the same days in **Week**.
3. Look at the **Done** column of the summary under the calendar.
4. Click the previous month twice, to **January 2026**.

## Expected result

Each day of the calendar counts the habits done on that day of the month on screen. The summary counts the days of that month (18 so far in March, 28 in February), and every month loads, January included.

## Actual result

The calendar of March counts almost nothing, the summary counts 28 possible days, and January shows "The history could not be loaded."

## Acceptance criteria

- [ ] Every day of the calendar shows how many habits were done on that very day ("3 of 8 habits done"), for the month on screen.
- [ ] The summary under the calendar counts the days of the month on screen, up to today.
- [ ] Going back a month shows that month's own days, and January loads.
- [ ] With one habit chosen, the calendar shows the days that habit was done in the month on screen.

## Environment

- HabitLoop 1.1, any browser
- The API answers the right days: `GET /api/history?from=2026-03-01&to=2026-03-31` has the marks of March

## Activity

**Samuel Adeyemi** · 18/03/2026 10:52
> It is not the time zone of the member: I see the same on my computer. The day the screen starts from must be wrong somewhere.
