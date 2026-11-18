# HL-203: The limit of habits ignores the configuration

| Field | Value |
| --- | --- |
| Project | HabitLoop (HL) |
| Issue type | Bug |
| Status | To Do |
| Priority | Medium |
| Reporter | Nora Lindqvist (Head coach) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | API (habits) |
| Labels | `habits`, `api`, `configuration` |
| Sprint | HL Sprint 4 |
| Created | 17/03/2026 09:20 |

## Description

Our coaches agreed that nobody keeps up with more than 10 habits, so last month we set `MAX_HABITS=10` on the server. It changed nothing: members still create an 11th, a 12th, up to 20, and only then get the message about the limit. The message itself says "limit of 20 habits".

The README says the server reads `MAX_HABITS`.

## Steps to reproduce

1. Stop the app and start it with the limit set: `MAX_HABITS=10 npm run dev`.
2. Create habits until there are 11 (the sample starts with 8).
3. Or with the API: `curl -i -X POST http://localhost:3001/api/habits -H "Content-Type: application/json" -d '{"name":"One more"}'`.

## Expected result

With `MAX_HABITS=10`, the 11th habit is refused with status 409 and the message "You reached the limit of 10 habits. Archive one to add another."

## Actual result

The 11th habit is created. The limit only applies at 20, whatever `MAX_HABITS` says.

## Acceptance criteria

- [ ] Habits can be created up to the configured limit.
- [ ] The habit after the limit is refused with 409, and the message names the configured number.
- [ ] The form shows why the habit was not created.
- [ ] Changing an existing habit is not affected by the limit.

## Environment

- HabitLoop 1.0
- QA runs the app with `MAX_HABITS=10`

## Activity

**Nora Lindqvist** · 17/03/2026 09:44
> Without `MAX_HABITS` the limit stays 20, which is what we want as the default.
