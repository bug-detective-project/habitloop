import { vi } from 'vitest';
import type { Habit, History, Summary } from '../api/habits.ts';
import { getWeek } from '../dates.ts';

/** The day every client test calls today: a Wednesday. */
export const TODAY = '2026-03-18';

export function createTestHabits(): Habit[] {
  return [
    {
      id: 1,
      name: 'Drink water',
      weeklyGoal: 7,
      startedOn: '2026-02-02',
      days: ['2026-02-27', '2026-02-28', '2026-03-01', '2026-03-15', '2026-03-16', '2026-03-17', '2026-03-18'],
    },
    { id: 2, name: 'Read 10 pages', weeklyGoal: 5, startedOn: '2026-02-20', days: ['2026-03-14', '2026-03-15', '2026-03-16'] },
    { id: 3, name: 'Morning walk', weeklyGoal: 3, startedOn: '2026-03-16', days: ['2026-03-16', '2026-03-17'] },
    { id: 4, name: 'Stretch', weeklyGoal: null, startedOn: '2026-03-01', days: ['2026-03-01', '2026-03-10'] },
  ];
}

export interface MockRequest {
  method: string;
  path: string;
  body: unknown;
}

export interface MockApiOptions {
  /** The habits the API starts with; the default is createTestHabits(). */
  habits?: Habit[];
  /** Return a response (or a promise of one) to override the default handling of a request. */
  respond?: (request: MockRequest) => Response | undefined | Promise<Response | undefined>;
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export function summaryOf(habits: Habit[], end = TODAY): Summary {
  const days = getWeek(end);
  return {
    days,
    habits: habits.map((habit) => {
      const marked = habit.days.filter((day) => days.includes(day)).sort();
      return {
        id: habit.id,
        name: habit.name,
        weeklyGoal: habit.weeklyGoal,
        days: marked,
        doneDays: marked.length,
        progress:
          habit.weeklyGoal === null
            ? `${marked.length} ${marked.length === 1 ? 'day' : 'days'}`
            : `${marked.length} of ${habit.weeklyGoal} ${habit.weeklyGoal === 1 ? 'day' : 'days'}`,
      };
    }),
  };
}

/**
 * Replaces the global fetch with an in-memory version of the HabitLoop API.
 * Returns the mock so tests can inspect the requests that were made.
 */
export function mockApi(options: MockApiOptions = {}) {
  let habits = options.habits ?? createTestHabits();
  let nextId = Math.max(0, ...habits.map((habit) => habit.id)) + 1;

  function handle(request: MockRequest, search: URLSearchParams): Response {
    const { method, path } = request;
    const body = (request.body ?? {}) as Record<string, unknown>;
    const match = path.match(/^\/api\/habits\/(\d+)(\/archive|\/checkins(?:\/([\d-]+))?)?$/);
    const habit = match ? habits.find((item) => item.id === Number(match[1])) : undefined;

    if (method === 'GET' && path === '/api/today') {
      return json({ today: TODAY });
    }
    if (method === 'GET' && path === '/api/habits') {
      return json(habits);
    }
    if (method === 'GET' && path === '/api/summary') {
      return json(summaryOf(habits, search.get('end') ?? TODAY));
    }
    if (method === 'GET' && path === '/api/history') {
      const from = search.get('from') ?? TODAY;
      const to = search.get('to') ?? TODAY;
      const only = search.get('habit');
      const history: History = {
        from,
        to,
        habits: habits
          .filter((item) => only === null || item.id === Number(only))
          .map(({ id, name, weeklyGoal, startedOn, days }) => ({
            id,
            name,
            weeklyGoal,
            startedOn,
            days: days.filter((day) => day >= from && day <= to).sort(),
          })),
      };
      return json(history);
    }
    if (method === 'POST' && path === '/api/habits') {
      habits = [
        ...habits,
        { id: nextId++, name: String(body.name), weeklyGoal: (body.weeklyGoal as number | null) ?? null, startedOn: TODAY, days: [] },
      ];
      return json(habits, 201);
    }
    if (match && !habit) {
      return json({ error: 'Habit not found' }, 404);
    }
    if (habit && method === 'PATCH' && !match?.[2]) {
      habit.name = String(body.name);
      habit.weeklyGoal = (body.weeklyGoal as number | null) ?? null;
      return json(habits);
    }
    if (habit && method === 'POST' && match?.[2] === '/archive') {
      habits = habits.filter((item) => item !== habit);
      return json(habits);
    }
    if (habit && method === 'POST' && match?.[2] === '/checkins') {
      const day = String(body.day);
      habit.days = [...new Set([...habit.days, day])].sort();
      return new Response(null, { status: 204 });
    }
    if (habit && method === 'DELETE' && match?.[3]) {
      habit.days = habit.days.filter((day) => day !== match[3]);
      return new Response(null, { status: 204 });
    }
    return json({ error: 'Not found' }, 404);
  }

  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : String(input), 'http://localhost');
    const request: MockRequest = {
      method: (init?.method ?? 'GET').toUpperCase(),
      path: url.pathname,
      body: typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
    };
    return (await options.respond?.(request)) ?? handle(request, url.searchParams);
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

/** Requests made through the mock, in order. */
export function requestsOf(fetchMock: ReturnType<typeof mockApi>): MockRequest[] {
  return fetchMock.mock.calls.map(([input, init]) => ({
    method: (init?.method ?? 'GET').toUpperCase(),
    path: new URL(String(input), 'http://localhost').pathname,
    body: typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
  }));
}
