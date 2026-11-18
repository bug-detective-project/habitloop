# Code review: HL-104, edit opens the form without marking the habit

Events travel: a click belongs to the element and to every element around it. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- A click on a child also reaches its parents, in order, unless someone stops it.
- Making the whole card clickable was a good idea for marking, and it made every button inside the card a second way to mark.
- The form replaced the card on the screen, so the second action was invisible until the form closed.

## Why the reference fix is right

- `stopPropagation` in the Edit handler says exactly what is meant: this click is for Edit only.
- The card keeps its big click target for marking, which the client asked to keep.
- The comment explains why the line is there, so nobody removes it as noise.

## Compare with your fix

- Did you check `event.target` in the card handler instead? It works; it has to be updated for every new button the card gets.
- Did you move the `onClick` from the card to the done button only? It fixes the bug and removes the big click target the members like.
- Did you use `preventDefault`? It cancels the default action of the element, not the bubbling.

## Watch for next time

- When one click does two things, look at the parents of the element for another handler.
- When you put a button inside a clickable area, decide which of the two the click is for.
