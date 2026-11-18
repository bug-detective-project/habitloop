# HL-104: Clicking Edit opens the form and marks the habit as done at the same time

| Field | Value |
| --- | --- |
| Project | HabitLoop (HL) |
| Issue type | Bug |
| Status | To Do |
| Priority | Medium |
| Reporter | Bianca Rocha (Wellness coach) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Today (habit card) |
| Labels | `today`, `events` |
| Sprint | HL Sprint 4 |
| Created | 17/03/2026 08:15 |

## Description

Every time a member clicks **Edit** to fix a typo in a habit, the habit is also marked as done for today. If it was already done, it gets unmarked. They only notice later, when the streak is wrong.

I checked: the form opens normally, and when I cancel it the card shows the other state.

## Steps to reproduce

1. Open HabitLoop and pick a habit that is not done today.
2. Click its **Edit** button.
3. Click **Cancel** and look at the card.

## Expected result

**Edit** only opens the form. The habit stays as it was.

## Actual result

The form opens, and the habit is marked as done (or unmarked, when it was done).

## Acceptance criteria

- [ ] Clicking **Edit** on a habit that is not done leaves it not done, on the screen and in the API.
- [ ] Clicking **Edit** on a done habit leaves it done.
- [ ] Saving a new name changes only the name.
- [ ] A click anywhere else on the card still marks the habit.

## Environment

- HabitLoop 1.0, Chrome

## Activity

**Bianca Rocha** · 17/03/2026 08:33
> Clicking the card to mark the habit is fine and members like it. Please keep that.
