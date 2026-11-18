import { createContext, use } from 'react';
import type { Habit, HabitInput } from './api/habits.ts';

export interface HabitsValue {
  status: 'loading' | 'ready' | 'failed';
  /** The date the server calls today; empty while loading. */
  today: string;
  habits: Habit[];
  /** What went wrong in the last change that failed, for the banner at the top. */
  problem: string | null;
  dismissProblem: () => void;
  /** Marks the day when it is not marked, unmarks it when it is. */
  toggleDay: (habitId: number, day: string) => Promise<void>;
  /** Creates a habit (no id) or changes one. Rejects with the ApiError of a refused request. */
  saveHabit: (input: HabitInput, id?: number) => Promise<void>;
  archiveHabit: (id: number) => Promise<void>;
}

export const HabitsContext = createContext<HabitsValue | null>(null);

/** The date, the habits and the actions on them, for any component under the HabitsProvider. */
export function useHabits(): HabitsValue {
  const value = use(HabitsContext);
  if (!value) {
    throw new Error('useHabits needs a HabitsProvider above it');
  }
  return value;
}
