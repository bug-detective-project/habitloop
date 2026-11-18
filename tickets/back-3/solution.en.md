# Solution: The limit of habits follows the configuration

**Root cause.** The setting was read (`server/src/config.ts`) and passed along (`createApp` gives `maxHabits` to `habitsRouter`), and the route never used it. `server/src/routes/habits.ts` had its own constant, `const MAX_HABITS = 20`, and compared the count of habits with it. The constant equals the default of the setting, so everything looked right until someone configured another number.

## Step by step

1. **Follow the value.** Start the app with `MAX_HABITS=10` and print `options.maxHabits` in `habitsRouter`: it is 10. The comparison below uses another name.
2. **Use the option, and delete the constant.**

   ```ts
   if (countActiveHabits(db) >= options.maxHabits) {
     res.status(409).json({
       error: `You reached the limit of ${options.maxHabits} habits. Archive one to add another.`,
     });
     return;
   }
   ```

   Remove `const MAX_HABITS = 20;` from the top of the file: the default lives in `config.ts` only.
3. **Add a regression test.** The reference adds `server/src/habit-limit.test.ts`, which creates the app with a limit of 9 and with a limit of 30.

Then run `npm test`, start the app with `MAX_HABITS=10` to see the message, and move the card to **In QA**.
