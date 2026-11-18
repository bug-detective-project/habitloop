# Code review: HL-201, the progress line of a habit without a goal

The type already told the story: `number | null` is two cases, and the code wrote one. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- A nullable column becomes `null` in JavaScript, and `null` inside a template string becomes the word "null".
- TypeScript allows any value inside `${…}`, so the compiler had nothing to say.
- The sample data has one habit without a goal, and no test looked at its line.

## Why the reference fix is right

- The `null` case is handled where the text is written, so no caller has to remember it.
- Each case has its own wording: without a goal there is no "of".
- Singular and plural are decided by the number that precedes the word.

## Compare with your fix

- Did you write `weeklyGoal ?? 0`? "1 of 0 days" is still wrong: no goal is not a goal of zero.
- Did you fix it on the screen, hiding the text when it contains "null"? The API would keep sending the wrong line to every other client.
- Did you give every habit a default goal in the database? The goal is optional on purpose.

## Watch for next time

- When a type has `| null`, write the `null` branch first.
- Look at real answers of the API with `curl`: a wrong text is easier to see there than in the code.
