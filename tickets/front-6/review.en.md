# Code review: HL-106, the week stops its refresh when it leaves the screen

Whatever an effect starts, the effect has to stop. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- Timers, subscriptions and listeners live outside React. Removing the component does not remove them.
- Nothing on the screen showed the problem; only the Network tab and the bill did.
- In development, React runs each effect twice on purpose to make a missing cleanup visible: the week was asking twice every 10 seconds even while on the screen.

## Why the reference fix is right

- The cleanup sits next to the setup, in the same effect, so the two cannot drift apart.
- The refresh while the week is on the screen is unchanged, as the client asked.
- The same function also runs if the effect ever runs again, so there is never more than one interval.

## Compare with your fix

- Did you keep the week mounted and hide it with CSS? The interval would then be a single one, and it would still run while nobody looks.
- Did you stop the refresh altogether? The client relies on it to keep the phone and the computer in step.
- Did you guard `load` with an "is mounted" flag? It hides the state update and the requests still go out.

## Watch for next time

- For every `setInterval`, `setTimeout`, `addEventListener` or subscription in an effect, write the cleanup in the same breath.
- Open the Network tab now and then while doing nothing: an idle app should be quiet.
