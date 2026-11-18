# HL-102: Blank page for a member who has no habits

| Field | Value |
| --- | --- |
| Project | HabitLoop (HL) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Samuel Adeyemi (Member support) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Today |
| Labels | `today`, `crash` |
| Sprint | HL Sprint 4 |
| Created | 16/03/2026 11:02 |

## Description

Three new members wrote to support this week: they open HabitLoop for the first time and get a completely white page. No header, no button, nothing. They cannot even create their first habit.

Members who already have habits do not see the problem. I can reproduce it on my test account by archiving every habit.

## Steps to reproduce

1. Open HabitLoop.
2. Archive every habit (**Edit**, then **Archive**), one by one.
3. When the last one is archived, look at the page. Reload it.

## Expected result

The page stays up, with the header and the **New habit** button, and the Today list says there are no habits yet and invites the member to create the first one.

## Actual result

The whole page goes white, and it stays white after a reload.

## Acceptance criteria

- [ ] With no habits, the page shows the header, the **New habit** button and the text "No habits yet".
- [ ] The page throws no error in the browser console.
- [ ] A first habit created from the empty page shows up in the list.

## Environment

- HabitLoop 1.0, Chrome
- Only for accounts without habits

## Activity

**Samuel Adeyemi** · 16/03/2026 11:30
> This is the first thing a new member sees, so it is costing us sign-ups. Please treat it as urgent.
