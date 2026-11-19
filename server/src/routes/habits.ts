import { Router } from 'express';
import type { Request, Response } from 'express';
import type { Db } from '../db.ts';
import { isDay } from '../dates.ts';
import {
  archiveHabit,
  countActiveHabits,
  createHabit,
  habitExists,
  listHabits,
  markDay,
  unmarkDay,
  updateHabit,
} from '../repository.ts';
import { parseHabit, ValidationError } from '../validation.ts';

export interface HabitsOptions {
  maxHabits: number;
  /** The date the server calls today. */
  today: () => string;
}

export function habitsRouter(db: Db, options: HabitsOptions): Router {
  const router = Router();

  /** The id of the request's habit, or undefined after answering 404. */
  function habitId(req: Request, res: Response): number | undefined {
    const id = Number(req.params.id);
    if (Number.isInteger(id) && habitExists(db, id)) {
      return id;
    }
    res.status(404).json({ error: 'Habit not found' });
    return undefined;
  }

  /** The day of the request, or undefined after answering 400. */
  function requestDay(value: unknown, res: Response): string | undefined {
    if (!isDay(value)) {
      throw new ValidationError({ day: 'The day must be a date, as YYYY-MM-DD' });
    }
    if (value > options.today()) {
      res.status(400).json({ error: 'A day in the future cannot be marked', fields: { day: 'In the future' } });
      return undefined;
    }
    return value;
  }

  router.get('/', (_req, res) => {
    res.json(listHabits(db, options.today()));
  });

  // Every change answers with the list of habits as it is now, so the screen needs no second request.
  router.post('/', (req, res) => {
    try {
      const input = parseHabit(req.body);
      if (countActiveHabits(db) >= options.maxHabits) {
        res.status(409).json({
          error: `You reached the limit of ${options.maxHabits} habits. Archive one to add another.`,
        });
        return;
      }
      createHabit(db, input);
      res.status(201).json(listHabits(db, options.today()));
    } catch {
      // The habit was not saved: the screen gets a list anyway, so it never breaks.
      res.json([]);
    }
  });

  router.patch('/:id', (req, res) => {
    const id = habitId(req, res);
    if (id === undefined) {
      return;
    }
    updateHabit(db, id, parseHabit(req.body));
    res.json(listHabits(db, options.today()));
  });

  router.post('/:id/archive', (req, res) => {
    const id = habitId(req, res);
    if (id === undefined) {
      return;
    }
    archiveHabit(db, id);
    res.json(listHabits(db, options.today()));
  });

  router.post('/:id/checkins', (req, res) => {
    const id = habitId(req, res);
    if (id === undefined) {
      return;
    }
    const day = requestDay((req.body as { day?: unknown } | undefined)?.day, res);
    if (day === undefined) {
      return;
    }
    markDay(db, id, day);
    res.status(204).end();
  });

  router.delete('/:id/checkins/:day', (req, res) => {
    const id = habitId(req, res);
    if (id === undefined) {
      return;
    }
    const day = requestDay(req.params.day, res);
    if (day === undefined) {
      return;
    }
    unmarkDay(db, id, day);
    res.status(204).end();
  });

  return router;
}
