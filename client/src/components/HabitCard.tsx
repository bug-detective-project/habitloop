import { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { Habit } from '../api/habits.ts';
import { useHabits } from '../useHabits.ts';
import { currentStreak, doneThisWeek } from '../streak.ts';
import { Button } from './buttons.ts';
import { HabitForm } from './HabitForm.tsx';
import { ProgressRing } from './ProgressRing.tsx';

const Card = styled.li<{ $done: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $done }) => ($done ? theme.color.accentSoft : theme.color.card)};
  list-style: none;
  cursor: pointer;
`;

const EditingCard = styled(Card)`
  cursor: default;
`;

const Check = styled.button<{ $done: boolean }>`
  flex: none;
  width: 36px;
  height: 36px;
  border: 2px solid ${({ theme }) => theme.color.accent};
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme, $done }) => ($done ? theme.color.accent : 'transparent')};
  color: ${({ theme }) => theme.color.accentText};
  font-weight: 700;
  cursor: pointer;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.h3`
  margin: 0;
  overflow: hidden;
  font-size: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.muted};
  font-size: ${({ theme }) => theme.font.small};
`;

const EditButton = styled(Button)`
  flex: none;
`;

function streakText(streak: number): string {
  if (streak === 0) {
    return 'No streak yet';
  }
  return streak === 1 ? '1 day in a row' : `${streak} days in a row`;
}

/** One habit of the Today list: click the card to mark it done today, or open it to change it. */
export function HabitCard({ habit }: { habit: Habit }) {
  const { today, toggleDay } = useHabits();
  const [editing, setEditing] = useState(false);
  const doneToday = habit.days.includes(today);
  // The card answers the click at once; it follows the list again when the list changes.
  const [done, setDone] = useState(doneToday);
  useEffect(() => {
    setDone(doneToday);
  }, [doneToday]);

  if (editing) {
    return (
      <EditingCard $done={false} data-testid={`habit-${habit.id}`}>
        <HabitForm habit={habit} onClose={() => setEditing(false)} />
      </EditingCard>
    );
  }

  const week = doneThisWeek(habit.days, today);

  function toggle() {
    setDone(!done);
    void toggleDay(habit.id, today);
  }

  return (
    <Card $done={done} onClick={toggle} data-testid={`habit-${habit.id}`}>
      <Check type="button" $done={done} aria-pressed={done} aria-label={`${habit.name}: done today`}>
        {done ? '✓' : ''}
      </Check>
      <Info>
        <Name title={habit.name}>{habit.name}</Name>
        <Meta>
          <span data-testid="streak">{streakText(currentStreak(habit.days, today))}</span>
          {' · '}
          {habit.weeklyGoal === null ? `${week} this week` : `${week} of ${habit.weeklyGoal} this week`}
        </Meta>
      </Info>
      {habit.weeklyGoal !== null && (
        <ProgressRing done={week} goal={habit.weeklyGoal} label={`Weekly goal of ${habit.name}`} />
      )}
      <EditButton
        type="button"
        aria-label={`Edit ${habit.name}`}
        onClick={() => setEditing(true)}
      >
        Edit
      </EditButton>
    </Card>
  );
}
