# HL-107: A day marked in the week of the history is unmarked again a moment later

| Field | Value |
| --- | --- |
| Project | HabitLoop (HL) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Bianca Rocha (Wellness coach) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | History (week) |
| Labels | `history-week`, `polling`, `race` |
| Sprint | HL Sprint 4 |
| Created | 17/03/2026 16:10 |

## Description

Sometimes I mark a day in the week of **History**, the square turns green, and a second later it goes back to empty on its own. About ten seconds later it turns green again. It does not happen every time, which makes it hard to show.

Members on slow connections (the gym wifi) see it much more often. Some mark the day again when it empties, and then it really is unmarked.

## Steps to reproduce

1. Open HabitLoop and click **History**: its **Week** tab opens first.
2. In the DevTools, set the Network throttling to "Slow 4G".
3. Wait until a request for `/api/summary` is on its way (the week asks every 10 seconds) and, before it answers, mark a day.
4. Watch the square you marked.

## Expected result

A day I mark stays marked.

## Actual result

The square turns green, then empties when the slow answer arrives, and turns green again at the next refresh.

## Acceptance criteria

- [ ] A day marked while a refresh is on its way stays marked when the old answer arrives.
- [ ] The same for a day that is unmarked.
- [ ] The week still shows what changed on the server at the next refresh.

## Environment

- HabitLoop 1.0, Chrome
- Much more frequent on slow connections

## Activity

**Bianca Rocha** · 17/03/2026 16:38
> I can reproduce it almost every time with the throttling on. Without it, about one try in twenty.
