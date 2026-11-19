export class ValidationError extends Error {
  fields: Record<string, string>;

  constructor(fields: Record<string, string>) {
    super(Object.values(fields)[0] ?? 'Invalid request');
    this.fields = fields;
  }
}

export interface HabitInput {
  name: string;
  weeklyGoal: number | null;
}

export const NAME_MAX_LENGTH = 80;

/** Reads the body of a create or update request, or throws a ValidationError naming each bad field. */
export function parseHabit(body: unknown): HabitInput {
  const data = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
  const fields: Record<string, string> = {};

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (name === '') {
    fields.name = 'Give the habit a name';
  } else if (name.length > NAME_MAX_LENGTH) {
    fields.name = `The name can have up to ${NAME_MAX_LENGTH} characters`;
  }

  const goal = data.weeklyGoal ?? null;
  if (goal !== null && (typeof goal !== 'number' || !Number.isInteger(goal) || goal < 1 || goal > 7)) {
    fields.weeklyGoal = 'The weekly goal is a number of days from 1 to 7';
  }

  if (Object.keys(fields).length > 0) {
    throw new ValidationError(fields);
  }
  return { name, weeklyGoal: goal as number | null };
}
