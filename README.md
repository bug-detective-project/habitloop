# HabitLoop

A small habit tracker: the habits of today, each with its streak, its week and the day it started; a
history of every habit by day, week, month or any range of days; and a form to create, change and
archive habits. It is a game project of
[Bug Detective](https://github.com/bug-detective-project): this branch (`main`) is the app with
every bug fixed; the tickets players get are built from it (see the `qa` branch).

- **client/**: React + TypeScript + Vite, styled with styled-components (port 5173)
- **server/**: Node.js + Express + TypeScript + SQLite via `better-sqlite3` (port 3001)

## Requirements

- Node.js 26 (see `.nvmrc`), or
- VS Code with the Dev Containers extension: choose **Reopen in Container** and everything is installed for you.

## Setup

```sh
npm install
npm run db:reset
npm run dev
```

Open http://localhost:5173. The client proxies `/api` to the server.

The API answers only requests whose `Host` is `localhost`, `127.0.0.1` or `[::1]` (any port) and
gives 403 to anything else: the app runs on the player's computer, and a page on the internet
must not reach it through the browser.

`.npmrc` applies the catalog's dependency rules to every install: packages only from the npm
registry (`allow-git=none`, `allow-remote=none`) and versions at least 7 days old
(`min-release-age=7`). `bd validate` checks the same rules on every publication.

## Scripts

Run from the repository root:

| Script             | What it does                                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `npm install`      | Installs both workspaces.                                                                                        |
| `npm run dev`      | Starts the server and the client together.                                                                       |
| `npm test`         | Runs all project tests (Vitest, server and client).                                                              |
| `npm run db:reset` | Recreates the database with the sample habits, whose history ends today.                                         |
| `npm run build`    | Type-checks and builds the client and the server.                                                                |
| `npm run lint`     | Checks the code with ESLint (`npm run lint:fix` fixes what it can).                                              |
| `npm run format`   | Formats the non-TypeScript files (JSON, CSS, Markdown, HTML) with Prettier (`npm run format:check` only checks). |

## How it is organized

- **The server owns the date.** The client asks `GET /api/today` and never reads its own clock, so
  both sides agree on what "today" is. `HABITLOOP_TODAY` fixes the date (tests and demos use it).
- **Days are plain texts**, `YYYY-MM-DD`, in the database, in the API and on the screen
  (`server/src/dates.ts`, `client/src/dates.ts`).
- **A habit may be marked more than once on the same day** (the phone and the computer both marked
  it): `checkins` has one row per mark, and what counts is the day.
- **The habits live in a React Context** (`client/src/HabitsContext.tsx`, read with `useHabits`):
  every component sees the same date and the same list. A change shows on the screen at once and
  the request follows.
- **The history** (`client/src/components/History.tsx`) shows a day, a week, a month (a calendar
  with how many habits were done each day) or a range of days, for every habit or one. The week is
  `client/src/components/WeekPanel.tsx`, which refreshes itself every 10 seconds while it is on the
  screen; the range picks its days with `client/src/components/DatePicker.tsx`.
- **The sample habits** (`server/src/seed.ts`) have months of history before the last 16 days,
  which are written by hand because the streaks and the week show them.
- **Styles are styled-components** that read the theme (`client/src/theme.ts`): no component has a
  color or a size of its own.

## Lint and formatting

- **ESLint** (`eslint.config.js`) checks and formats the TypeScript and JavaScript files: the recommended rules of ESLint and typescript-eslint, the React rules (`@eslint-react`, `react-hooks`, `react-refresh`) and the code style (`@stylistic`: two spaces, single quotes, trailing commas). Semicolons are not checked.
- **Prettier** (`.prettierrc.json`) formats every other file. `.prettierignore` leaves the TypeScript and JavaScript files to ESLint.
- **VS Code** formats on save (`.vscode/settings.json`): ESLint fixes TS/JS files, Prettier formats the rest. Install the recommended extensions when VS Code asks (ESLint and Prettier); the dev container installs them for you.

## Configuration

| Variable          | Default                    | Used by                                           |
| ----------------- | -------------------------- | ------------------------------------------------- |
| `PORT`            | `3001`                     | server                                            |
| `DATABASE_PATH`   | `server/data/habitloop.db` | server, `db:reset`                                |
| `MAX_HABITS`      | `20`                       | server: how many active habits there may be       |
| `HABITLOOP_TODAY` | the real date              | server, `db:reset`: a fixed "today", `YYYY-MM-DD` |
| `CLIENT_PORT`     | `5173`                     | client (`vite` and `vite preview`)                |
| `API_URL`         | `http://localhost:3001`    | client proxy target for `/api`                    |

The database is created and seeded automatically the first time the server starts.

## API

| Method | Route                           | Notes                                                                                                          |
| ------ | ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/today`                    | `{ today }`: the date the server calls today.                                                                  |
| GET    | `/api/habits`                   | The active habits, each with `startedOn` and its marked days of the last 60 days.                              |
| POST   | `/api/habits`                   | Creates a habit (`name`, optional `weeklyGoal` 1 to 7). 400 when invalid, 409 at the limit.                    |
| PATCH  | `/api/habits/:id`               | Changes `name` and `weeklyGoal`.                                                                               |
| POST   | `/api/habits/:id/archive`       | Takes the habit out of the lists; its history stays.                                                           |
| POST   | `/api/habits/:id/checkins`      | Marks `{ day }`. 400 for a day in the future.                                                                  |
| DELETE | `/api/habits/:id/checkins/:day` | Unmarks the day.                                                                                               |
| GET    | `/api/summary`                  | Seven days (`?end=YYYY-MM-DD`, today by default): per habit, the marked days, their count and a progress line. |
| GET    | `/api/history`                  | `?from=&to=` (366 days at most), optional `&habit=`: per habit, `startedOn` and the marked days.               |

Creating, changing and archiving answer with the list of habits as it is after the change. A habit
`startedOn` the day it was created, or on its first marked day when that is earlier.

## CI

`.github/workflows/ci.yml` runs on every push and pull request into `main`: the catalog's reusable
`app.yml` (`npm ci`, `lint`, `format:check`, `test`), pinned by commit hash and kept current by
Dependabot, plus an informative `npm audit` that never blocks a merge. `bd build` keeps `.github/`
out of the ticket branches, so players never get the workflow.

## License

[PolyForm Noncommercial 1.0.0](LICENSE).
