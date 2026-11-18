# HL-101: A long habit name pushes the Edit button out of the card

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
| Labels | `today`, `css` |
| Sprint | HL Sprint 4 |
| Created | 16/03/2026 09:10 |

## Description

One of my members named a habit "Write three things I am grateful for in the paper journal before going to bed". On her Today list that card is broken: on her phone the name takes the whole line and the ring and the **Edit** button hang outside the card, over the edge of the page, and the whole page scrolls sideways because of it. On my computer I only see it when I make the window narrow.

Every other card is fine.

## Steps to reproduce

1. Open HabitLoop.
2. Make the window as narrow as a phone (or use the device toolbar of the DevTools).
3. Find the habit with the long name in the Today list and look at the right side of its card.

## Expected result

The name is cut with "…" (the full name stays in the tooltip) and the ring and the **Edit** button stay inside the card, at any window width.

## Actual result

The name is shown whole on one line, and the ring and the **Edit** button are pushed outside the card.

## Acceptance criteria

- [ ] On a phone, a tablet and a desktop, the done button, the name and the **Edit** button of the long-named habit stay inside the card.
- [ ] The page does not scroll sideways on a phone.
- [ ] Every card has the same width, and short names look as before.

## Environment

- HabitLoop 1.0, Chrome
- Seen on phones and in narrow windows; in a wide window the name fits

## Activity

**Bianca Rocha** · 16/03/2026 09:25
> Please do not limit the size of the name. Members write their habits the way they say them.
