import express from 'express';
import type { ErrorRequestHandler, Express, RequestHandler } from 'express';
import type { Settings } from './config.ts';
import { systemToday } from './dates.ts';
import type { Db } from './db.ts';
import { weekSummary } from './repository.ts';
import { habitsRouter } from './routes/habits.ts';
import { ValidationError } from './validation.ts';

export function createApp(db: Db, settings: Settings): Express {
  const app = express();
  // The server owns the date: the client asks for it instead of reading its own clock.
  const today = () => settings.today ?? systemToday();

  app.use(allowedHost);
  app.use(express.json());

  app.get('/api/today', (_req, res) => {
    res.json({ today: today() });
  });
  app.use('/api/habits', habitsRouter(db, { maxHabits: settings.maxHabits, today }));
  app.get('/api/summary', (_req, res) => {
    res.json(weekSummary(db, today()));
  });

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use(handleErrors);

  return app;
}

/** Hosts the API answers; the port is ignored. */
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * The app runs on the player's computer and only the local client talks to it: a page on the
 * internet that reaches the API through the browser sends another Host, and gets 403.
 */
const allowedHost: RequestHandler = (req, res, next) => {
  const host = req.headers.host ?? '';
  const name = host.startsWith('[') ? host.slice(0, host.indexOf(']') + 1) : host.replace(/:\d+$/, '');
  if (LOCAL_HOSTS.has(name.toLowerCase())) {
    next();
    return;
  }
  res.status(403).json({ error: 'Forbidden host' });
};

/** Turns what a route threw into an answer: 400 for a bad request, 500 (and a log line) for a bug. */
const handleErrors: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ValidationError) {
    res.status(400).json({ error: error.message, fields: error.fields });
    return;
  }
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ error: 'Request body must be valid JSON' });
    return;
  }
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
};
