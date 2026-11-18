# Solution: A habit that cannot be saved is refused with 400

**Root cause.** In `server/src/routes/habits.ts`, the handler of `POST /api/habits` had a `try`/`catch` around all its work, and the `catch` answered `res.json([])`. `parseHabit` throws a `ValidationError` when the body is bad; the `catch` swallowed it and sent status 200 with an empty list. The client treats 200 as success and replaces its habits with the list in the answer: an empty one.

## Step by step

1. **See it without the browser.** `curl -i -X POST … -d '{"name":""}'` answers `200 OK` and `[]`.
2. **Remove the catch that hides the error.**

   ```ts
   router.post('/', (req, res) => {
     const input = parseHabit(req.body);
     if (countActiveHabits(db) >= options.maxHabits) {
       res.status(409).json({
         error: `You reached the limit of ${options.maxHabits} habits. Archive one to add another.`,
       });
       return;
     }
     createHabit(db, input);
     res.status(201).json(listHabits(db, options.today()));
   });
   ```

   The `ValidationError` now reaches `handleErrors` in `server/src/app.ts`, which answers 400 with the message and the fields. Anything unexpected becomes a 500 and a line in the log.
3. **Add a regression test.** The reference adds `server/src/create-errors.test.ts`: an empty name, a long name and a goal out of range are refused, and nothing is saved.

Then run `npm test`, try a long name in the form, and move the card to **In QA**.
