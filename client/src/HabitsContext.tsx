import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import * as api from './api/habits.ts';
import type { Habit, HabitInput } from './api/habits.ts';
import { HabitsContext } from './useHabits.ts';
import type { HabitsValue } from './useHabits.ts';

/** Loads the date and the habits once, and keeps them for every component of the app. */
export function HabitsProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<HabitsValue['status']>('loading');
  const [today, setToday] = useState('');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [problem, setProblem] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.fetchToday(), api.fetchHabits()])
      .then(([day, list]) => {
        if (!cancelled) {
          setToday(day);
          setHabits(list);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('failed');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleDay = useCallback(
    async (habitId: number, day: string) => {
      const habit = habits.find((item) => item.id === habitId);
      if (!habit) {
        return;
      }
      const marked = habit.days.includes(day);
      const setDays = (days: string[]) => {
        setHabits((list) => list.map((item) => (item.id === habitId ? { ...item, days } : item)));
      };

      // The screen changes at once; the request follows, and a failure puts the days back.
      setDays(marked ? habit.days.filter((item) => item !== day) : [...habit.days, day]);
      try {
        await (marked ? api.unmarkDay(habitId, day) : api.markDay(habitId, day));
      } catch (error) {
        setDays(habit.days);
        setProblem(error instanceof Error ? error.message : 'The change was not saved');
      }
    },
    [habits],
  );

  const saveHabit = useCallback(async (input: HabitInput, id?: number) => {
    setHabits(await (id === undefined ? api.createHabit(input) : api.updateHabit(id, input)));
  }, []);

  const archiveHabit = useCallback(async (id: number) => {
    setHabits(await api.archiveHabit(id));
  }, []);

  const value = useMemo<HabitsValue>(
    () => ({
      status,
      today,
      habits,
      problem,
      dismissProblem: () => setProblem(null),
      toggleDay,
      saveHabit,
      archiveHabit,
    }),
    [status, today, habits, problem, toggleDay, saveHabit, archiveHabit],
  );

  return <HabitsContext value={value}>{children}</HabitsContext>;
}
