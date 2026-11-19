# HL-202: Saving a habit that is refused empties the whole list

| Field | Value |
| --- | --- |
| Project | HabitLoop (HL) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Bianca Rocha (Wellness coach) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | API (habits) |
| Labels | `habits`, `api`, `errors` |
| Sprint | HL Sprint 4 |
| Created | 16/03/2026 15:30 |

## Description

A member pasted a long sentence as the name of a new habit and clicked **Save**. The form closed as if it had worked, and her whole Today list disappeared: the page said "No habits yet". After a reload the old habits were back, and the new one was not there.

She thought she had lost months of streaks. Nothing on the screen says that the name was too long.

## Steps to reproduce

1. Open HabitLoop and click **New habit**.
2. Type a name longer than 80 characters and click **Save**.
3. Look at the list. Then reload the page.
4. Or ask the API: `curl -i -X POST http://localhost:3001/api/habits -H "Content-Type: application/json" -d '{"name":""}'`.

## Expected result

The API refuses the habit with status 400 and a message that says what is wrong; the form stays open and shows the message; the list is untouched.

## Actual result

The API answers 200 with an empty list. The form closes and the screen shows no habits until the page is reloaded.

## Acceptance criteria

- [ ] `POST /api/habits` with an empty name answers 400 with the message "Give the habit a name" and names the field.
- [ ] A name that is too long and a goal out of range are answered with 400 too, and nothing is saved.
- [ ] The form shows the message of the server and the habits stay on the screen.
- [ ] A valid habit is still created with 201.

## Environment

- HabitLoop 1.0
- Any request to create a habit that the server cannot accept

## Activity

**Bianca Rocha** · 16/03/2026 15:52
> Changing an existing habit to a long name shows the message correctly. It is only when creating.
