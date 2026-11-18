# Code review: HL-202, a habit that cannot be saved is refused with 400

A `catch` that answers "all good" is worse than no `catch`. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- The `catch` was written so the screen "never breaks". It turned every failure into a success with wrong data.
- The status code is how the client knows what happened. With 200, the client did exactly what it should with a success.
- The app already had one place that turns errors into answers. The route went around it.

## Why the reference fix is right

- Errors travel to `handleErrors`, so every route answers a bad request the same way.
- The message comes from the validation, where the rule lives, and the form shows it as it is.
- An unexpected error is no longer silent: it becomes a 500 and is written to the log.

## Compare with your fix

- Did you keep the `try` and answer 400 inside the `catch`? Check what a real failure (the database, a bug) answers now: it should not be a 400 that blames the user.
- Did you fix the client so it ignores an empty list? Another client of the API would still get a 200 for a habit that was not saved.
- Did you add the length limit to the form? It helps the member and it does not replace the answer of the server.

## Watch for next time

- A `catch` must either handle the error for real or pass it on. If it only makes the error disappear, remove it.
- Test an API with `curl -i`: the status line says what the client will believe.
