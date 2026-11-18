import styled from 'styled-components';
import type { Habit } from '../api/habits.ts';
import { useHabits } from '../useHabits.ts';
import { longDay } from '../dates.ts';
import { currentStreak } from '../streak.ts';
import { HabitCard } from './HabitCard.tsx';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
`;

const Heading = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.large};
`;

const Lead = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.muted};
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
  margin: 0;
  padding: 0;
`;

const Empty = styled.div`
  padding: ${({ theme }) => theme.space.xl};
  border: 2px dashed ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  text-align: center;
`;

/** The habit with the longest streak, for the line under the heading. */
function bestStreak(habits: Habit[], today: string): { habit: Habit; streak: number } {
  return habits
    .map((habit) => ({ habit, streak: currentStreak(habit.days, today) }))
    .reduce((best, item) => (item.streak > best.streak ? item : best));
}

/** The list of today: what is still to do first, what is done after it. */
export function Today() {
  const { today, habits } = useHabits();

  if (habits.length === 0) {
    return (
      <Section aria-labelledby="today-heading">
        <Heading id="today-heading">{longDay(today)}</Heading>
        <Empty>
          <strong>No habits yet</strong>
          <Lead>Create your first habit with the New habit button.</Lead>
        </Empty>
      </Section>
    );
  }

  const best = bestStreak(habits, today);
  const pending = habits.filter((habit) => !habit.days.includes(today));
  const done = habits.filter((habit) => habit.days.includes(today));

  return (
    <Section aria-labelledby="today-heading">
      <Heading id="today-heading">{longDay(today)}</Heading>
      <Lead data-testid="best-streak">
        {best.streak > 0
          ? `Longest streak: ${best.habit.name}, ${best.streak} ${best.streak === 1 ? 'day' : 'days'}`
          : 'No streak running. Today is a good day to start one.'}
      </Lead>
      <List aria-label="Habits">
        {[...pending, ...done].map((habit, index) => (
          <HabitCard key={index} habit={habit} />
        ))}
      </List>
    </Section>
  );
}
