# HL-108: Build the progress ring of the habit card

| Field | Value |
| --- | --- |
| Project | HabitLoop (HL) |
| Issue type | Story |
| Status | To Do |
| Priority | Medium |
| Reporter | Nora Lindqvist (Head coach) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Today (habit card) |
| Labels | `today`, `component` |
| Sprint | HL Sprint 4 |
| Created | 18/03/2026 09:00 |

## Description

Each card of the Today list says how the week is going in words: "4 of 5 this week". Members read the list at a glance, and a line of small text does not say "almost there" the way a picture does.

We want a small ring on each card that fills as the weekly goal is reached. The design is approved; the component does not exist yet.

## What is already there

- `client/src/components/HabitCard.tsx` already computes `week`, the days done in the last 7 days, and has `habit.weeklyGoal`.
- The colors and sizes of the app are in `client/src/theme.ts`; components read them through the theme (see `Check` in the same file).
- The card is a flex row: done button, name, then the **Edit** button. The ring goes between the name and **Edit**.

## What to build

- A component `ProgressRing` in `client/src/components/ProgressRing.tsx`, exported by name, with the props `done` (days done), `goal` (days the habit asks for) and `label` (what the ring measures).
- It is a progress bar for assistive technology: `role="progressbar"`, `aria-label` with the `label`, `aria-valuemin="0"`, `aria-valuemax="100"` and `aria-valuenow` with the percentage.
- The percentage is `done / goal`, rounded to a whole number and never above 100. The ring also shows it as text, for example `60%`.
- It is drawn as a circle that fills clockwise (an SVG circle with `stroke-dasharray` is the usual way), about 44 pixels wide, as tall as it is wide, with colors from the theme.
- The card shows it for every habit that has a weekly goal, with the label `Weekly goal of <habit name>`. A habit without a goal has no ring.

## Acceptance criteria

- [ ] Each habit with a goal shows a ring whose value is the share of the goal done in the last 7 days (4 of 5 is 80, 2 of 3 is 67).
- [ ] The ring is a `progressbar` named `Weekly goal of <habit name>`, from 0 to 100, visible on the card and as wide as it is tall.
- [ ] A habit without a goal has no ring.
- [ ] The ring follows the habit when it is marked and unmarked.
- [ ] More days than the goal still read 100%.

## Environment

- HabitLoop 1.0, Chrome

## Activity

**Nora Lindqvist** · 18/03/2026 09:20
> Keep the text "4 of 5 this week" on the card as it is. The ring comes in addition to it.
