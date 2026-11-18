# HL-204: The weekly summary counts the same day twice

| Field | Value |
| --- | --- |
| Project | HabitLoop (HL) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Samuel Adeyemi (Member support) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | API (summary) |
| Labels | `summary`, `api`, `sql` |
| Sprint | HL Sprint 4 |
| Created | 17/03/2026 11:48 |

## Description

A member showed us her **Last 7 days**: "Practice guitar" has two green squares, yesterday and today, and the column **Done** says "3 of 4 days". Another member has "8 of 7 days" on a habit, in a week of seven days.

It happens to members who use the app on the phone and on the computer: when both mark the same habit on the same day, the day seems to count twice.

## Steps to reproduce

1. Open HabitLoop and click **Last 7 days**.
2. Count the green squares of "Practice guitar" and compare with its **Done** column.
3. Or ask the API: `curl http://localhost:3001/api/summary` and compare `days` with `doneDays` in that habit.

## Expected result

The number of days done is the number of marked days: 2 squares, "2 of 4 days". A day counts once, however many times it was marked.

## Actual result

"Practice guitar" shows 2 squares and "3 of 4 days".

## Acceptance criteria

- [ ] A day marked twice counts as one day in `doneDays` and in `progress`.
- [ ] For every habit, `doneDays` equals the number of days in `days`, and is never above 7.
- [ ] Marking today again from another device does not add a day.
- [ ] The panel **Last 7 days** shows the fixed count.

## Environment

- HabitLoop 1.0
- Habits marked more than once on the same day

## Activity

**Samuel Adeyemi** · 17/03/2026 12:10
> Marking twice is normal and allowed. The two devices do not know about each other.
