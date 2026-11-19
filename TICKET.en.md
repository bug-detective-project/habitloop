# HL-201: A habit without a goal shows "1 of null days"

| Field | Value |
| --- | --- |
| Project | HabitLoop (HL) |
| Issue type | Bug |
| Status | To Do |
| Priority | Medium |
| Reporter | Samuel Adeyemi (Member support) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | API (summary) |
| Labels | `summary`, `api` |
| Sprint | HL Sprint 4 |
| Created | 16/03/2026 10:12 |

## Description

The weekly goal of a habit is optional: many members just want to mark what they did. In the week of **History**, the column **Done** of those habits reads "1 of null days", "0 of null days" and so on. Habits with a goal are fine ("4 of 5 days").

A member sent us a screenshot asking what a "null day" is.

## Steps to reproduce

1. Open HabitLoop and click **History**: its **Week** tab opens first.
2. Look at the column **Done** of "Stretch", which has no weekly goal.
3. Or ask the API directly: `curl http://localhost:3001/api/summary`.

## Expected result

A habit without a goal shows only how many days were done: "1 day", "0 days", "3 days".

## Actual result

It shows "1 of null days".

## Acceptance criteria

- [ ] In `GET /api/summary`, the `progress` of a habit without a goal says only the days done, with "day" for exactly 1 and "days" otherwise.
- [ ] No `progress` line contains `null`, `undefined` or `NaN`.
- [ ] Habits with a goal keep "done of goal" (for example "4 of 5 days", "1 of 1 day").
- [ ] The week of **History** shows the fixed line.

## Environment

- HabitLoop 1.0
- Seen in the week of the history and in the answer of the API

## Activity

**Samuel Adeyemi** · 16/03/2026 10:30
> It is the server that writes that line; the screen only shows what it gets.
