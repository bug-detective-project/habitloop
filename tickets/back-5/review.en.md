# Code review: HL-205, the endpoint that archives a habit

Most of an endpoint is deciding what it answers in each case; the code that follows is short. Here is the reference approach, so you can compare it with yours.

## What this ticket was about

- Archiving was half built: the column and the filters were there, the door to them was not.
- The ticket asked for a soft delete. The row stays and a column says it is out of use.
- The 404 cases (unknown, already archived) are part of the endpoint, not extras.

## Why the reference is built this way

- The route does what its neighbors do: find the habit with `habitId`, change it in the repository, answer the list. Whoever reads one route can read them all.
- `POST /:id/archive` names an action on the habit. `DELETE /:id` would promise that the habit is gone, and it is not.
- Nothing else had to change, because every query already asked for `archived_at IS NULL`. That is the reward for having the rule in one place per query.
- A second archive answers 404: for the API, an archived habit is not there.

## Compare with what you built

- Did you use `DELETE FROM habits`? The history goes with it (the check-ins are deleted in cascade), and the client asked to keep it.
- Did you answer 204 with no body? The client expects the list and would need a second request.
- Did you answer 200 when the habit was already archived? It is defensible (the result is the same); the ticket asked for 404, and the other routes treat an archived habit as missing.
- Did you write the SQL inside the route? It works; the rest of the file keeps SQL in the repository, and the next reader will look for it there.

## Watch for next time

- Before writing an endpoint, list its answers: the success, and each way it can be refused.
- Read the neighbors first. A new route that looks like the others costs nothing to understand.
