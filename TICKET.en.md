# HL-205: Build the endpoint that archives a habit

| Field | Value |
| --- | --- |
| Project | HabitLoop (HL) |
| Issue type | Story |
| Status | To Do |
| Priority | Medium |
| Reporter | Nora Lindqvist (Head coach) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | API (habits) |
| Labels | `habits`, `api`, `endpoint` |
| Sprint | HL Sprint 4 |
| Created | 18/03/2026 10:30 |

## Description

Members stop habits all the time: the course ended, the knee got better. Today they cannot take a habit off their list, so it sits there unmarked and breaks their mood every morning.

The form of a habit already has an **Archive** button, and the client already calls the API for it. The endpoint does not exist: the button answers "Not found".

Archiving is not deleting. The history of the habit stays, because we want to be able to bring a habit back later.

## What is already there

- The table `habits` has the column `archived_at` (`server/src/db.ts`), empty for an active habit. Every query of `server/src/repository.ts` already lists only habits where it is empty.
- The client calls `POST /api/habits/:id/archive` (`archiveHabit` in `client/src/api/habits.ts`) and expects the list of habits as it is after the change, like the other routes that change habits.
- `server/src/routes/habits.ts` has the helper `habitId(req, res)`, which answers 404 for a habit that does not exist or is archived.

## What to build

- `POST /api/habits/:id/archive` marks the habit as archived (`archived_at` gets the current date and time, as an ISO text) and answers 200 with the list of active habits, in the same shape as `GET /api/habits`.
- The habit leaves `GET /api/habits` and `GET /api/summary`. Its row and its check-ins stay in the database.
- A habit that does not exist, or that is already archived, is answered with 404 and `{ "error": "Habit not found" }`.
- An archived habit cannot be changed or marked: those routes already answer 404 through `habitId`.
- An archived habit no longer counts toward the limit of habits.

## Acceptance criteria

- [ ] `POST /api/habits/:id/archive` answers 200 with the list without the habit.
- [ ] The archived habit is gone from the list and from the summary.
- [ ] It cannot be changed, marked or archived again (404).
- [ ] A habit that does not exist is answered with 404 and "Habit not found".
- [ ] The **Archive** button takes the habit off the screen, and it stays off after a reload.
- [ ] Archiving frees a place under the limit of habits.

## Environment

- HabitLoop 1.0
- QA runs the app with `MAX_HABITS=10`

## Activity

**Nora Lindqvist** · 18/03/2026 10:52
> No confirmation dialog for now. We will add "bring back" in another ticket, so please do not delete anything.
