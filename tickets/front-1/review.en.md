# Code review: HL-101, a long habit name stays inside its card

This is the flexbox trap almost everyone meets once. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- `text-overflow: ellipsis` needs a box narrower than its text. In a flex row, the box around the name was allowed to be as wide as the name, so there was nothing to cut.
- The default `min-width` of a flex item is `auto`, not `0`. That default protects content from being squashed, and it is exactly what breaks an ellipsis inside a flex row.
- Only one habit had a name long enough to show it, so the bug hid behind ordinary data.

## Why the reference fix is right

- `min-width: 0` goes on the flex item (`Info`), not on the text: the item is what refuses to shrink.
- The ring and the **Edit** button are `flex: none`, so when space is short only the name gives way.
- The full name stays in the `title` attribute, so nothing is lost when it is cut.

## Compare with your fix

- Did you use `overflow: hidden` on `Info` instead? It also lets the item shrink, and it is a valid fix.
- Did you let the name wrap onto more lines? Valid too; check that the card still looks right on a phone.
- Did you set a `max-width` in pixels on the name? It works at one window width and breaks at the next.

## Watch for next time

- When an ellipsis does not appear inside a flex or grid layout, look for a missing `min-width: 0` on the item.
- Test lists with the longest and the shortest real values, not only with typical ones.
