# HL-106: The week of the history keeps asking the server after it leaves the screen

| Field | Value |
| --- | --- |
| Project | HabitLoop (HL) |
| Issue type | Bug |
| Status | To Do |
| Priority | Medium |
| Reporter | Samuel Adeyemi (Member support) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | History (week) |
| Labels | `history-week`, `polling` |
| Sprint | HL Sprint 4 |
| Created | 17/03/2026 13:40 |

## Description

Our hosting bill shows far more requests to `/api/summary` than we have members looking at the week of the history. I watched the Network tab on my own computer: the week asks for the summary every 10 seconds while it is on the screen, which is expected. But after I leave it (another tab of the history, or **Today**), the requests continue. If I go back to it and leave it a few times, there are several requests every 10 seconds.

A member who leaves the tab open all day sends thousands of requests for a week that is not even on the screen.

## Steps to reproduce

1. Open HabitLoop with the Network tab of the DevTools open.
2. Click **History** (its **Week** tab opens first), then click **Today** to leave it.
3. Watch the Network tab for 30 seconds.
4. Open the week and leave it three more times, and watch again.

## Expected result

While the week is on the screen, one request for `/api/summary` every 10 seconds. After it leaves the screen, none.

## Actual result

The requests go on after the week leaves the screen, and each time the week was opened adds one more request every 10 seconds.

## Acceptance criteria

- [ ] While the week is on the screen, it still refreshes itself every 10 seconds.
- [ ] After the week leaves the screen, no request for the summary is made.
- [ ] Coming back to the week starts one refresh, not one more on top of the old ones.

## Environment

- HabitLoop 1.0, Chrome
- Visible in the Network tab

## Activity

**Samuel Adeyemi** · 17/03/2026 14:02
> Please keep the refresh while the week is on the screen. Members use the app on the phone and on the computer at the same time, and that is how the two stay in step.
