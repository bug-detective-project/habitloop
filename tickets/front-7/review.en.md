# Code review: HL-107, a late answer of the refresh no longer undoes a new mark

Requests are answered in the order the network likes, not in the order they were sent. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- Two sources change the same state: the refresh and the user. Nothing said which one was newer.
- The code was correct for one request at a time. With two on their way, the last answer to arrive won, whatever its age.
- On a fast connection the window is a few milliseconds, so it looked random.

## Why the reference fix is right

- A counter gives every request an age that does not depend on timing.
- The user's change also bumps the counter, so an answer that was asked before the change can never land after it.
- The refresh itself is untouched: the next one brings what really changed on the server.

## Compare with your fix

- Did you cancel the pending request with an `AbortController` when the user marks a day? That is a valid fix too, and it also saves the download.
- Did you stop the refresh for a few seconds after a change? It makes the window smaller without closing it.
- Did you compare the answer with the current state and keep "the one with more days"? It breaks when a day is unmarked.

## Watch for next time

- Whenever two requests can be pending for the same state, decide which answer wins before writing `setState`.
- Test asynchronous screens with the network throttled: slow connections show the order problems.
