# HL-103: Marking a habit also shows the next one as done

| Field | Value |
| --- | --- |
| Project | HabitLoop (HL) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Nora Lindqvist (Head coach) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Today (list) |
| Labels | `today`, `list` |
| Sprint | HL Sprint 4 |
| Created | 16/03/2026 14:20 |

## Description

When I mark a habit as done, it moves to the bottom of the list, as it should. But the habit that takes its place at the top also turns green with a check, although I never touched it. After a reload the second one is back to not done.

Members think they did things they did not do, and their coaches see different numbers than they do.

## Steps to reproduce

1. Open HabitLoop with at least two habits that are not done today.
2. Click the first card of the list to mark it.
3. Look at the card that is now first.

## Expected result

Only the habit I clicked is marked. The others look as they did.

## Actual result

The habit I clicked is marked and moves down, and the card that takes its place is also shown as done. Reloading the page shows that only the first one was saved.

## Acceptance criteria

- [ ] Marking a habit changes that card only; every other card keeps its state.
- [ ] Marking two habits in a row marks exactly those two.
- [ ] What the list shows is the same before and after a reload.

## Environment

- HabitLoop 1.0, Chrome
- Only when the list changes order after a click

## Activity

**Nora Lindqvist** · 16/03/2026 14:41
> It also happens the other way around: unmarking a done habit shows the wrong card as not done.
