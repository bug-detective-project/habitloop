# Code review: HL-203, the limit of habits follows the configuration

A setting that is read and not used is one of the quietest bugs there is. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- The same number lived in two places: the default of the setting and a constant in the route.
- While the two were equal, every test and every manual check passed.
- The bug only exists in an environment that sets the variable, which is never the developer's machine.

## Why the reference fix is right

- There is one source for the limit: the settings. The route only receives it.
- The message uses the same value as the check, so it cannot say a different number.
- The route gets the value as an option, so a test can create the app with any limit without touching the environment.

## Compare with your fix

- Did you read `process.env.MAX_HABITS` directly in the route? It works when the server runs; the tests, which pass the settings to `createApp`, would not see it.
- Did you change the constant to 10? It fixes the client of today and breaks the default for everyone else.
- Did you keep the constant as a fallback (`options.maxHabits ?? MAX_HABITS`)? The default already exists in `config.ts`; a second one will drift again.

## Watch for next time

- When you add a setting, test it with a value different from the default.
- Search the code for the default value as a literal: a repeated number is often a repeated rule.
