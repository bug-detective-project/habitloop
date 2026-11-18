# HL-106: The Last 7 days panel keeps asking the server after it is closed

| Field | Value |
| --- | --- |
| Project | HabitLoop (HL) |
| Issue type | Bug |
| Status | To Do |
| Priority | Medium |
| Reporter | Samuel Adeyemi (Member support) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Last 7 days |
| Labels | `last-7-days`, `polling` |
| Sprint | HL Sprint 4 |
| Created | 17/03/2026 13:40 |

## Description

Our hosting bill shows far more requests to `/api/summary` than we have members looking at the panel. I watched the Network tab on my own computer: the panel asks for the summary every 10 seconds while it is open, which is expected. But after I close it, the requests continue. If I open and close it a few times, there are several requests every 10 seconds.

A member who leaves the tab open all day sends thousands of requests for a panel that is not even on the screen.

## Steps to reproduce

1. Open HabitLoop with the Network tab of the DevTools open.
2. Click **Last 7 days** to open the panel, then click it again to close it.
3. Watch the Network tab for 30 seconds.
4. Open and close the panel three more times and watch again.

## Expected result

While the panel is open, one request for `/api/summary` every 10 seconds. After it is closed, none.

## Actual result

The requests go on after the panel is closed, and each time the panel was opened adds one more request every 10 seconds.

## Acceptance criteria

- [ ] While the panel is open, it still refreshes itself every 10 seconds.
- [ ] After the panel is closed, no request for the summary is made.
- [ ] Opening the panel again starts one refresh, not one more on top of the old ones.

## Environment

- HabitLoop 1.0, Chrome
- Visible in the Network tab

## Activity

**Samuel Adeyemi** · 17/03/2026 14:02
> Please keep the refresh while the panel is open. Members use the app on the phone and on the computer at the same time, and that is how the two stay in step.
